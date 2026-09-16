import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Lock, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useOwner } from '@/lib/owner-context';
import { OwnerPanel } from './OwnerPanel';

export function EditButton() {
  const { isOwner, login } = useOwner();
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOwner) {
      setShowLogin(false);
    }
  }, [isOwner]);

  const handleEditClick = () => {
    if (isOwner) {
      setShowPanel(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    const { error: loginError } = await login(trimmed);
    setLoading(false);
    if (loginError) {
      setError(loginError);
    } else {
      setPassword('');
      setShowLogin(false);
      setShowPanel(true);
    }
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating edit button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        onClick={handleEditClick}
        className="fixed bottom-5 right-5 z-[9000] w-11 h-11 rounded-full bg-[#060810]/90 border border-[#0e1220] backdrop-blur-md flex items-center justify-center text-dim hover:text-[#4a9eff] hover:border-[#1a2a4a] transition-all duration-300 shadow-lg group"
        aria-label="Edit portfolio"
      >
        <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
      </motion.button>

      {/* Login modal */}
      <AnimatePresence>
        {showLogin && !isOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9700] flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowLogin(false)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            <motion.form
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleLogin}
              className="relative z-10 w-full max-w-sm glass-panel p-6 sm:p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-[#4a9eff]" />
                  <span className="font-cinematic text-lg text-white tracking-wide">OWNER ACCESS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-8 h-8 rounded-sm border border-[#0e1220] flex items-center justify-center text-dim hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono-cine tracking-widest text-dim block">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    autoFocus
                    className="w-full bg-[#04060c] border border-[#0e1220] rounded-sm px-4 py-3 pr-11 text-sm text-white focus:border-[#1a2a4a] focus:outline-none transition-colors"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-[#4a9eff] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs text-[#4a9eff] font-mono-cine tracking-wider">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="btn-cinematic w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                {loading ? 'AUTHENTICATING...' : 'ENTER'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <OwnerPanel open={showPanel} onClose={() => setShowPanel(false)} />
    </>
  );
}
