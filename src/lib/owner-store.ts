import { createContext, useContext } from 'react';
import type { PortfolioFile } from './supabase';

export interface OwnerState {
  isOwner: boolean;
  token: string | null;
  files: Record<string, PortfolioFile & { url?: string }>;
  filesError: boolean;
  login: (password: string) => Promise<{ error?: string }>;
  logout: () => void;
  refreshFiles: () => Promise<void>;
}

export const OwnerContext = createContext<OwnerState | null>(null);

export function useOwner(): OwnerState {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error('useOwner must be used within OwnerProvider');
  return ctx;
}
