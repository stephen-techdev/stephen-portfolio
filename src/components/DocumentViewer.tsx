import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Eye, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: 'resume' | 'cv';
}

export function DocumentViewer({
  open,
  onClose,
  title,
  fileUrl,
  fileName,
  fileType,
}: DocumentViewerProps) {
  const [downloading, setDownloading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // Fetch PDF as blob when modal opens — bypasses X-Frame-Options
  useEffect(() => {
    if (!open || !fileUrl) {
      setLoadingState('idle');
      return;
    }

    setLoadingState('loading');

    // Revoke any previous blob URL
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
      setBlobUrl(null);
    }

    let cancelled = false;

    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        if (blob.type && !blob.type.includes('pdf') && blob.size < 100) {
          throw new Error('Not a valid PDF');
        }
        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setBlobUrl(url);
        setLoadingState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setLoadingState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [open, fileUrl]);

  // Cleanup blob URL on unmount or close
  useEffect(() => {
    if (!open && blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
      setBlobUrl(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const handleDownload = async () => {
    if (!fileUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName ?? `${fileType}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (fileUrl) window.open(fileUrl, '_blank');
  };

  const handleRetry = () => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
      setBlobUrl(null);
    }
    setLoadingState('loading');

    fetch(fileUrl!)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setBlobUrl(url);
        setLoadingState('ready');
      })
      .catch(() => {
        setLoadingState('error');
      });
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9500] flex items-center justify-center p-3 sm:p-4 md:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-4xl h-[80svh] md:h-[85vh] glass-panel flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-b border-[#0e1220]">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#4a9eff]" />
                <span className="font-cinematic text-xl text-white tracking-wide">{title}</span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-sm border border-[#0e1220] flex items-center justify-center text-dim hover:text-white hover:border-[#1a2a4a] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-[#04060c] relative">
              {!fileUrl ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <div className="w-16 h-16 rounded-full border border-[#0e1220] flex items-center justify-center">
                    <FileText size={28} className="text-[#1a2a4a]" />
                  </div>
                  <p className="text-sm text-dim font-mono-cine tracking-wider">
                    NO {fileType.toUpperCase()} UPLOADED YET
                  </p>
                  <p className="text-xs text-dim max-w-xs">
                    The owner has not uploaded a {fileType} file yet. Please check back later.
                  </p>
                </div>
              ) : loadingState === 'error' ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <div className="w-16 h-16 rounded-full border border-[#0e1220] flex items-center justify-center">
                    <AlertCircle size={28} className="text-[#4a9eff]" />
                  </div>
                  <p className="text-sm text-dim font-mono-cine tracking-wider">
                    {fileType.toUpperCase()} PREVIEW UNAVAILABLE
                  </p>
                  <p className="text-xs text-dim max-w-xs">
                    Your browser may not support inline PDF preview. Try opening it directly.
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={handleRetry}
                      className="btn-cinematic text-xs px-4 py-2.5 group"
                    >
                      <Eye size={14} />
                      RETRY
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="btn-cinematic text-xs px-4 py-2.5 group"
                    >
                      <ExternalLink size={14} className="transition-transform group-hover:scale-110" />
                      OPEN IN NEW TAB
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn-cinematic btn-accent text-xs px-4 py-2.5 group"
                    >
                      <Download size={14} className="transition-transform group-hover:translate-y-0.5" />
                      DOWNLOAD {fileType.toUpperCase()}
                    </button>
                  </div>
                </div>
              ) : loadingState === 'loading' ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#04060c]">
                  <Loader2 size={32} className="animate-spin text-[#4a9eff]" />
                  <p className="text-sm text-dim font-mono-cine tracking-wider">
                    LOADING {fileType.toUpperCase()}...
                  </p>
                </div>
              ) : (
                <iframe
                  src={blobUrl ?? undefined}
                  title={title}
                  className="w-full h-full border-0"
                  style={{ minHeight: '100%' }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 py-3 md:py-4 border-t border-[#0e1220]">
              <div className="flex items-center gap-2 text-xs text-dim font-mono-cine min-w-0">
                <Eye size={14} className="flex-shrink-0" />
                <span className="truncate">{fileUrl ? fileName ?? `${fileType}.pdf` : 'No file available'}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleOpenInNewTab}
                  disabled={!fileUrl}
                  className="btn-cinematic text-xs px-3 sm:px-4 py-2 md:py-2.5 group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ExternalLink size={14} className="transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">NEW TAB</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!fileUrl || downloading}
                  className="btn-cinematic btn-accent text-xs px-3 sm:px-4 py-2 md:py-2.5 group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
                  <span className="hidden sm:inline">{downloading ? 'PREPARING...' : 'DOWNLOAD'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
