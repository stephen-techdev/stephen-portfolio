import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  ownerLogin,
  ownerVerify,
  fetchPortfolioFiles,
  type PortfolioFile,
} from './supabase';

interface OwnerState {
  isOwner: boolean;
  token: string | null;
  files: Record<string, PortfolioFile & { url?: string }>;
  login: (password: string) => Promise<{ error?: string }>;
  logout: () => void;
  refreshFiles: () => Promise<void>;
}

const OwnerContext = createContext<OwnerState | null>(null);

const STORAGE_KEY = 'portfolio-owner-token';

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, PortfolioFile & { url?: string }>>({});

  const refreshFiles = useCallback(async () => {
    const data = await fetchPortfolioFiles();
    setFiles(data);
  }, []);

  useEffect(() => {
    refreshFiles();
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

  return (
    <OwnerContext.Provider value={{ isOwner, token, files, login, logout, refreshFiles }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error('useOwner must be used within OwnerProvider');
  return ctx;
}
