import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, RefreshCw, LogOut, Image as ImageIcon, FileText, FileBadge,
  Check, Loader2, ShieldCheck,
} from 'lucide-react';
import { useOwner } from '@/lib/owner-context';
import { ownerUpload, ownerDelete } from '@/lib/supabase';

interface OwnerPanelProps {
  open: boolean;
  onClose: () => void;
}

interface UploadSlotProps {
  label: string;
  icon: ReactNode;
  fileType: 'photo' | 'resume' | 'cv';
  hasFile: boolean;
  fileName?: string;
  token: string;
  onRefresh: () => Promise<void>;
}

function UploadSlot({ label, icon, fileType, hasFile, fileName, token, onRefresh }: UploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    const result = await ownerUpload(token, file, fileType);
    setUploading(false);
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage('Uploaded successfully');
      await onRefresh();
    }
    setTimeout(() => setMessage(''), 3000);
    e.target.value = '';
  };

  const handleDelete = async () => {
    setUploading(true);
    const result = await ownerDelete(token, fileType);
    setUploading(false);
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage('Deleted');
      await onRefresh();
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center text-[#4a9eff] flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-cinematic text-lg text-white tracking-wide">{label}</div>
          {hasFile ? (
            <div className="text-[10px] text-[#4a9eff] font-mono-cine tracking-wider truncate">
              Current: {fileName}
            </div>
          ) : (
            <div className="text-[10px] text-dim font-mono-cine tracking-wider">
              No file uploaded
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <label className="btn-cinematic cursor-pointer text-xs px-4 py-2.5 group">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : hasFile ? <RefreshCw size={14} /> : <Upload size={14} />}
          {hasFile ? 'REPLACE' : 'UPLOAD'}
          <input type="file" className="hidden" onChange={handleUpload} accept={
            fileType === 'photo' ? 'image/*' : '.pdf,.doc,.docx'
          } />
        </label>
        {hasFile && (
          <button
            onClick={handleDelete}
            disabled={uploading}
            className="btn-cinematic text-xs px-4 py-2.5 border-[#0a1a3a] text-[#4a9eff] hover:border-[#2a3a5a] disabled:opacity-40"
          >
            <X size={14} />
            REMOVE
          </button>
        )}
      </div>

      {message && (
        <div className={`text-xs font-mono-cine tracking-wider flex items-center gap-1.5 ${
          message.startsWith('Error') ? 'text-[#4a9eff]' : 'text-[#4a9eff]'
        }`}>
          {message.startsWith('Error') ? <X size={12} /> : <Check size={12} />}
          {message}
        </div>
      )}
    </div>
  );
}

export function OwnerPanel({ open, onClose }: OwnerPanelProps) {
  const { token, files, logout, refreshFiles } = useOwner();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9600] flex items-center justify-center p-3 sm:p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg glass-panel flex flex-col overflow-hidden max-h-[85svh] md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-b border-[#0e1220]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#4a9eff]" />
                <span className="font-cinematic text-xl text-white tracking-wide">OWNER ACCESS</span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-sm border border-[#0e1220] flex items-center justify-center text-dim hover:text-white hover:border-[#1a2a4a] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Authenticated badge */}
            <div className="px-6 py-3 border-b border-[#0e1220] bg-[#060810]/50">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#4a9eff]" />
                <span className="text-[10px] font-mono-cine tracking-widest text-[#4a9eff]">
                  AUTHENTICATED
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
              {token && (
                <>
                  {/* Content management label */}
                  <div className="scene-label pt-1">CONTENT MANAGEMENT</div>

                  <UploadSlot
                    label="PERSONAL PHOTO"
                    icon={<ImageIcon size={18} />}
                    fileType="photo"
                    hasFile={!!files.photo}
                    fileName={files.photo?.file_name}
                    token={token}
                    onRefresh={refreshFiles}
                  />
                  <UploadSlot
                    label="RESUME"
                    icon={<FileText size={18} />}
                    fileType="resume"
                    hasFile={!!files.resume}
                    fileName={files.resume?.file_name}
                    token={token}
                    onRefresh={refreshFiles}
                  />
                  <UploadSlot
                    label="CV"
                    icon={<FileBadge size={18} />}
                    fileType="cv"
                    hasFile={!!files.cv}
                    fileName={files.cv?.file_name}
                    token={token}
                    onRefresh={refreshFiles}
                  />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-t border-[#0e1220]">
              <span className="text-[10px] text-dim font-mono-cine tracking-widest">
                SESSION ACTIVE
              </span>
              <button
                onClick={handleLogout}
                className="btn-cinematic text-xs px-4 py-2.5 border-[#0a1a3a] text-[#4a9eff]"
              >
                <LogOut size={14} />
                LOG OUT
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
