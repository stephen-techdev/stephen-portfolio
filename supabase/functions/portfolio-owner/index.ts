import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_PASSWORD = "Steve862k8";
const SESSION_SECRET = Deno.env.get("SESSION_SECRET") ?? "portfolio-session-secret-862k8";

function makeToken(): string {
  const payload = {
    role: "owner",
    exp: Date.now() + 1000 * 60 * 60 * 4,
  nonce: crypto.randomUUID(),
  };
  const encoded = btoa(JSON.stringify(payload));
  const hash = btoa(SESSION_SECRET + encoded + SESSION_SECRET);
  return `${encoded}.${hash}`;
}

function verifyToken(token: string): boolean {
  try {
    const [encoded, hash] = token.split(".");
    if (!encoded || !hash) return false;
    const expected = btoa(SESSION_SECRET + encoded + SESSION_SECRET);
    if (hash !== expected) return false;
    const payload = JSON.parse(atob(encoded));
    if (payload.exp < Date.now()) return false;
    return payload.role === "owner";
  } catch {
    return false;
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
      const { password } = await req.json();
      const trimmed = typeof password === "string" ? password.trim() : "";
      if (trimmed !== OWNER_PASSWORD) {
        return json({ error: "Incorrect password" }, 401);
      }
      return json({ token: makeToken() });
    }

    // --- AUTH: verify ---
    if (path === "/verify" && req.method === "POST") {
      const { token } = await req.json();
      if (!token || !verifyToken(token)) {
        return json({ valid: false }, 401);
      }
      return json({ valid: true });
    }

    // --- All file operations require owner token ---
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!verifyToken(token)) {
      return json({ error: "Unauthorized" }, 403);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Upload file ---
    if (path === "/upload" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const fileType = formData.get("fileType") as string;

      if (!file || !fileType) {
        return json({ error: "Missing file or fileType" }, 400);
      }

      const allowedTypes = ["photo", "resume", "cv"];
      if (!allowedTypes.includes(fileType)) {
        return json({ error: "Invalid file type" }, 400);
      }

      const ext = file.name.split(".").pop() ?? "bin";
      const storagePath = `${fileType}/${fileType}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("portfolio-files")
        .upload(storagePath, arrayBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        return json({ error: uploadError.message }, 500);
      }

      const { error: dbError } = await supabase
        .from("portfolio_files")
        .upsert(
          {
            file_type: fileType,
            storage_path: storagePath,
            file_name: file.name,
            mime_type: file.type,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "file_type" },
        );

      if (dbError) {
        return json({ error: dbError.message }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-files")
        .getPublicUrl(storagePath);

      return json({
        success: true,
        url: publicUrlData.publicUrl,
        storagePath,
        fileName: file.name,
      });
    }

    // --- Delete file ---
    if (path === "/delete" && req.method === "POST") {
      const { fileType } = await req.json();
      if (!fileType) {
        return json({ error: "Missing fileType" }, 400);
      }

      const { data: fileRecord } = await supabase
        .from("portfolio_files")
        .select("storage_path")
        .eq("file_type", fileType)
        .maybeSingle();

      if (fileRecord) {
        await supabase.storage
          .from("portfolio-files")
          .remove([fileRecord.storage_path]);

        await supabase
          .from("portfolio_files")
          .delete()
          .eq("file_type", fileType);
      }

      return json({ success: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
});
