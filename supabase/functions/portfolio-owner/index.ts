import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  "X-Content-Type-Options": "nosniff",
};

// Secrets are required. There are deliberately no fallbacks: a missing secret
// must fail closed instead of silently using a value anyone can read in git.
const OWNER_PASSWORD_HASH = Deno.env.get("OWNER_PASSWORD_HASH") ?? "";
const SESSION_SECRET = Deno.env.get("SESSION_SECRET") ?? "";

const encoder = new TextEncoder();

function isConfigured(): boolean {
  return /^[a-f0-9]{64}$/.test(OWNER_PASSWORD_HASH) && SESSION_SECRET.length >= 32;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/** Constant-time comparison so token/password checks cannot be timed. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

let hmacKey: Promise<CryptoKey> | null = null;
function getHmacKey(): Promise<CryptoKey> {
  if (!hmacKey) {
    hmacKey = crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }
  return hmacKey;
}

interface TokenPayload {
  role: "owner";
  exp: number;
  nonce: string;
}

async function makeToken(): Promise<string> {
  const payload: TokenPayload = {
    role: "owner",
    exp: Date.now() + 1000 * 60 * 60 * 4,
    nonce: crypto.randomUUID(),
  };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await getHmacKey(), encoder.encode(encoded));
  return `${encoded}.${toBase64Url(new Uint8Array(signature))}`;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return false;
    const expected = toBase64Url(
      new Uint8Array(await crypto.subtle.sign("HMAC", await getHmacKey(), encoder.encode(encoded))),
    );
    if (!constantTimeEqual(signature, expected)) return false;

    const payload = JSON.parse(fromBase64Url(encoded)) as TokenPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false;
    return payload.role === "owner";
  } catch {
    return false;
  }
}

// --- Brute-force protection for /auth (best effort, per isolate) ---
interface Attempt {
  count: number;
  first: number;
  blockedUntil: number;
}
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function isBlocked(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (entry.blockedUntil > Date.now()) return true;
  if (Date.now() - entry.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return false;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now, blockedUntil: 0 });
  } else {
    entry.count += 1;
    if (entry.count >= MAX_ATTEMPTS) entry.blockedUntil = now + BLOCK_MS;
  }
  if (attempts.size > 500) {
    for (const [key, value] of attempts) {
      if (now - value.first > WINDOW_MS) attempts.delete(key);
    }
  }
}

function clearFailures(ip: string): void {
  attempts.delete(ip);
}

// --- Upload rules: MIME allowlist, size cap, and controlled extensions ---
type FileType = "photo" | "resume" | "cv";

interface FileRule {
  mime: Record<string, string>;
  maxBytes: number;
}

const FILE_RULES: Record<FileType, FileRule> = {
  photo: {
    mime: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    },
    maxBytes: 8 * 1024 * 1024,
  },
  resume: {
    mime: {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    },
    maxBytes: 10 * 1024 * 1024,
  },
  cv: {
    mime: {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    },
    maxBytes: 10 * 1024 * 1024,
  },
};

function isFileType(value: string): value is FileType {
  return value === "photo" || value === "resume" || value === "cv";
}

function safeFileName(name: string): string {
  return (name.split(/[\\/]/).pop() ?? "file")
    .replace(/[^a-zA-Z0-9._ -]/g, "")
    .slice(0, 120) || "file";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  let path = url.pathname;
  for (const prefix of ["/functions/v1/portfolio-owner", "/portfolio-owner"]) {
    if (path.startsWith(prefix)) path = path.slice(prefix.length);
  }
  if (path === "") path = "/";

  try {
    // --- AUTH: login ---
    if (path === "/auth" && req.method === "POST") {
      if (!isConfigured()) {
        console.error("[portfolio-owner] OWNER_PASSWORD_HASH and SESSION_SECRET must be configured");
        return json({ error: "Server is not configured" }, 500);
      }
      const ip = clientIp(req);
      if (isBlocked(ip)) {
        return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
      }

      const { password } = await req.json().catch(() => ({ password: "" }));
      const trimmed = typeof password === "string" ? password.trim() : "";
      const submittedHash = trimmed ? await sha256Hex(trimmed) : "";

      if (!trimmed || !constantTimeEqual(submittedHash, OWNER_PASSWORD_HASH)) {
        recordFailure(ip);
        return json({ error: "Incorrect password" }, 401);
      }

      clearFailures(ip);
      return json({ token: await makeToken() });
    }

    // --- AUTH: verify ---
    if (path === "/verify" && req.method === "POST") {
      if (!isConfigured()) return json({ valid: false }, 401);
      const { token } = await req.json().catch(() => ({ token: "" }));
      if (typeof token !== "string" || !(await verifyToken(token))) {
        return json({ valid: false }, 401);
      }
      return json({ valid: true });
    }

    // --- All file operations require a valid owner token ---
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!isConfigured() || !(await verifyToken(token))) {
      return json({ error: "Unauthorized" }, 403);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Upload file ---
    if (path === "/upload" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file");
      const fileType = formData.get("fileType");

      if (!(file instanceof File) || typeof fileType !== "string") {
        return json({ error: "Missing file or fileType" }, 400);
      }
      if (!isFileType(fileType)) {
        return json({ error: "Invalid file type" }, 400);
      }

      const rule = FILE_RULES[fileType];
      const extension = rule.mime[file.type];
      if (!extension) {
        return json({ error: `Unsupported file type. Allowed: ${Object.keys(rule.mime).join(", ")}` }, 400);
      }
      if (file.size === 0 || file.size > rule.maxBytes) {
        return json(
          { error: `File must be between 1 byte and ${Math.round(rule.maxBytes / 1024 / 1024)} MB` },
          400,
        );
      }

      const storagePath = `${fileType}/${fileType}.${extension}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("portfolio-files")
        .upload(storagePath, arrayBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("[portfolio-owner] storage upload failed", uploadError.message);
        return json({ error: "Upload failed" }, 500);
      }

      const { error: dbError } = await supabase
        .from("portfolio_files")
        .upsert(
          {
            file_type: fileType,
            storage_path: storagePath,
            file_name: safeFileName(file.name),
            mime_type: file.type,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "file_type" },
        );

      if (dbError) {
        console.error("[portfolio-owner] metadata upsert failed", dbError.message);
        return json({ error: "Could not save file metadata" }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-files")
        .getPublicUrl(storagePath);

      return json({
        success: true,
        url: publicUrlData.publicUrl,
        storagePath,
        fileName: safeFileName(file.name),
      });
    }

    // --- Delete file ---
    if (path === "/delete" && req.method === "POST") {
      const { fileType } = await req.json().catch(() => ({ fileType: "" }));
      if (!isFileType(fileType)) {
        return json({ error: "Invalid file type" }, 400);
      }

      const { data: fileRecord } = await supabase
        .from("portfolio_files")
        .select("storage_path")
        .eq("file_type", fileType)
        .maybeSingle();

      if (fileRecord) {
        const { error: removeError } = await supabase.storage
          .from("portfolio-files")
          .remove([fileRecord.storage_path]);
        if (removeError) {
          console.error("[portfolio-owner] storage delete failed", removeError.message);
          return json({ error: "Could not remove file" }, 500);
        }

        const { error: dbError } = await supabase
          .from("portfolio_files")
          .delete()
          .eq("file_type", fileType);
        if (dbError) {
          console.error("[portfolio-owner] metadata delete failed", dbError.message);
          return json({ error: "Could not remove file metadata" }, 500);
        }
      }

      return json({ success: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error("[portfolio-owner] unexpected error", err);
    return json({ error: "Internal server error" }, 500);
  }
});
