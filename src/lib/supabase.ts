import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FUNCTION_URL = `${supabaseUrl}/functions/v1/portfolio-owner`;

export interface PortfolioFile {
  file_type: 'photo' | 'resume' | 'cv';
  storage_path: string;
  file_name: string;
  mime_type: string;
  updated_at: string;
}

export async function fetchPortfolioFiles(): Promise<Record<string, PortfolioFile>> {
  const { data, error } = await supabase
    .from('portfolio_files')
    .select('*');

  if (error) return {};

  const map: Record<string, PortfolioFile> = {};
  for (const row of data ?? []) {
    map[row.file_type] = row as PortfolioFile;
    const { data: urlData } = supabase.storage
      .from('portfolio-files')
      .getPublicUrl(row.storage_path);
    (row as PortfolioFile & { url: string }).url = urlData.publicUrl;
  }
  return map;
}

export function getFileUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('portfolio-files')
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function ownerLogin(password: string): Promise<{ token?: string; error?: string }> {
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
    return { error: err instanceof Error ? err.message : 'Upload failed. Check connection and .env.' };
  }
}

export async function ownerDelete(
  token: string,
  fileType: 'photo' | 'resume' | 'cv',
): Promise<{ success?: boolean; error?: string }> {
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
}
