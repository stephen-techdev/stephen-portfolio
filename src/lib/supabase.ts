import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const FUNCTION_URL = isSupabaseConfigured
  ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1/portfolio-owner`
  : '';

const CONFIG_ERROR = 'Portfolio backend is not configured. See .env.example for setup.';

export interface PortfolioFile {
  file_type: 'photo' | 'resume' | 'cv';
  storage_path: string;
  file_name: string;
  mime_type: string;
  updated_at: string;
}

export async function fetchPortfolioFiles(): Promise<
  Record<string, PortfolioFile & { url?: string }> | null
> {
  if (!supabase) {
    console.warn(CONFIG_ERROR);
    return null;
  }

  const { data, error } = await supabase.from('portfolio_files').select('*');

  if (error) {
    console.error('[portfolio] Could not load portfolio files:', error.message);
    return null;
  }

  const map: Record<string, PortfolioFile & { url?: string }> = {};
  for (const row of data ?? []) {
    const file = row as PortfolioFile;
    const { data: urlData } = supabase.storage
      .from('portfolio-files')
      .getPublicUrl(file.storage_path);
    // Bust the CDN/browser cache when an owner replaces a file at the same path.
    const version = encodeURIComponent(file.updated_at);
    map[file.file_type] = { ...file, url: `${urlData.publicUrl}?v=${version}` };
  }
  return map;
}

export async function ownerLogin(password: string): Promise<{ token?: string; error?: string }> {
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR };
  try {
    const res = await fetch(`${FUNCTION_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Login failed' };
    return { token: data.token };
  } catch {
    return { error: 'Unable to reach server. Check your connection.' };
  }
}

export async function ownerVerify(token: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${FUNCTION_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export async function ownerUpload(
  token: string,
  file: File,
  fileType: 'photo' | 'resume' | 'cv',
): Promise<{ success?: boolean; url?: string; error?: string }> {
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR };
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  try {
    const res = await fetch(`${FUNCTION_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    let data: { error?: string; url?: string } = {};
    try {
      data = await res.json();
    } catch {
      return { error: `Upload failed (status ${res.status}). Check Supabase function deployment.` };
    }
    if (!res.ok) return { error: data.error ?? 'Upload failed' };
    return { success: true, url: data.url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed. Check connection.' };
  }
}

export async function ownerDelete(
  token: string,
  fileType: 'photo' | 'resume' | 'cv',
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { error: CONFIG_ERROR };
  try {
    const res = await fetch(`${FUNCTION_URL}/delete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileType }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Delete failed' };
    return { success: true };
  } catch {
    return { error: 'Delete failed. Check connection.' };
  }
}
