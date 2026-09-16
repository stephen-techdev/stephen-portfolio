import { useState } from 'react';
import { User } from 'lucide-react';

interface ProfilePhotoProps {
  src: string;
  alt: string;
  variant: 'hero' | 'about';
}

export function ProfilePhoto({ src, alt, variant }: ProfilePhotoProps) {
  const [imageError, setImageError] = useState(false);

  const heroFrame = variant === 'hero';

  return (
    <div className="relative">
      {/* Outer frame with cinematic border */}
      <div
        className={`relative overflow-hidden ${
          heroFrame
            ? 'w-[280px] h-[380px] md:w-[360px] md:h-[480px] lg:w-[420px] lg:h-[560px]'
            : 'w-[240px] h-[320px] md:w-[300px] md:h-[400px]'
        }`}
        style={{
          border: '1px solid rgba(74, 158, 255, 0.12)',
          borderRadius: '2px',
        }}
      >
        {/* Gradient border glow */}
        <div
          className="absolute -inset-px pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(74,158,255,0.08) 0%, transparent 30%, transparent 70%, rgba(42,90,138,0.05) 100%)',
            borderRadius: '2px',
          }}
        />

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#060810] to-[#04060c]">
            <div className="w-16 h-16 rounded-full border border-[#0e1220] flex items-center justify-center mb-3">
              <User size={28} className="text-[#1a2a4a]" />
            </div>
            <span className="text-[10px] font-mono-cine tracking-[0.2em] text-[#1a2a4a]">
              PHOTO PLACEHOLDER
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Cinematic overlay gradients */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#04060c]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#04060c]/30 to-transparent" />

        {/* Film grain on photo */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }} />
      </div>

      {/* Decorative accent line */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-px w-2/3"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(74,158,255,0.25), transparent)',
        }}
      />
    </div>
  );
}
