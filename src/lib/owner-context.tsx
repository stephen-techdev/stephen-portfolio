import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  ownerLogin,
  ownerVerify,
  fetchPortfolioFiles,
  isSupabaseConfigured,
  type PortfolioFile,
} from './supabase';
import { OwnerContext, type OwnerState } from './owner-store';

const STORAGE_KEY = 'portfolio-owner-token';

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, PortfolioFile & { url?: string }>>({});
  const [filesError, setFilesError] = useState(false);

  const refreshFiles = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setFiles({});
      setFilesError(true);
      return;
    }
    const data = await fetchPortfolioFiles();
    setFiles(data ?? {});
    setFilesError(data === null);
  }, []);

  useEffect(() => {
    void refreshFiles();
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      ownerVerify(stored).then((valid) => {
        if (valid) {
          setToken(stored);
          setIsOwner(true);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      });
    }
  }, [refreshFiles]);

  const login = useCallback(async (password: string) => {
    const { token: newToken, error } = await ownerLogin(password);
    if (error) return { error };
    if (newToken) {
      sessionStorage.setItem(STORAGE_KEY, newToken);
      setToken(newToken);
      setIsOwner(true);
      await refreshFiles();
      return {};
    }
    return { error: 'Login failed' };
  }, [refreshFiles]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setIsOwner(false);
  }, []);

  const state: OwnerState = { isOwner, token, files, filesError, login, logout, refreshFiles };

  return <OwnerContext.Provider value={state}>{children}</OwnerContext.Provider>;
}
