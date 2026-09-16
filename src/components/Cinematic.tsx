import { useEffect, useRef, memo, useMemo } from 'react';

export function FilmGrain() {
  return (
    <>
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="scanlines" />
      <LightningOverlay />
    </>
  );
}

/**
 * Occasional lightning flash — randomized timing, CSS animation.
 * No rAF loop, no React state updates during flash.
 */
function LightningOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const boltRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let secondaryTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const strike = (index: number, left: number) => {
      const bolt = boltRefs.current[index];
      if (!bolt) return;
      bolt.style.left = `${left}%`;
      bolt.classList.remove('bolt-flash');
      void bolt.offsetWidth;
      bolt.classList.add('bolt-flash');
    };

    const scheduleFlash = () => {
      const min = prefersReducedMotion ? 12000 : isMobile ? 8000 : 5000;
      const range = prefersReducedMotion ? 13000 : isMobile ? 10000 : 9000;
      const delay = min + Math.random() * range;

      timeout = setTimeout(() => {
        if (cancelled) return;
        const overlay = overlayRef.current;
        if (!overlay) return;

        overlay.classList.remove('flash');
        void overlay.offsetWidth;
        overlay.classList.add('flash');

        const primaryIndex = Math.floor(Math.random() * boltRefs.current.length);
        const minLeft = isMobile ? 20 : 15;
        const maxLeft = isMobile ? 80 : 85;
        const primaryLeft = minLeft + Math.random() * (maxLeft - minLeft);
        strike(primaryIndex, primaryLeft);

        if (!prefersReducedMotion && Math.random() > 0.35) {
          secondaryTimeout = setTimeout(() => {
            if (cancelled) return;
            const secondaryIndex = (primaryIndex + 1) % boltRefs.current.length;
            strike(secondaryIndex, Math.max(minLeft, Math.min(maxLeft, primaryLeft + (Math.random() - 0.5) * 24)));
          }, 130 + Math.random() * 180);
        }

        scheduleFlash();
      }, delay);
    };

    scheduleFlash();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      if (secondaryTimeout) clearTimeout(secondaryTimeout);
    };
  }, []);

  return (
    <>
      <div ref={overlayRef} className="lightning-overlay" />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(element) => { boltRefs.current[index] = element; }}
          className="lightning-bolt"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M100 0 L80 180 L120 180 L60 360 L110 360 L50 600"
              fill="none"
              stroke="rgba(180, 220, 255, 0.9)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(120, 180, 255, 0.8))' }}
            />
            <path
              d="M100 0 L80 180 L120 180 L60 360 L110 360 L50 600"
              fill="none"
              stroke="rgba(220, 240, 255, 0.6)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
              style={{ filter: 'blur(3px)' }}
            />
          </svg>
        </div>
      ))}
    </>
  );
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={ref}
      className="loading-screen"
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      <div className="text-center">
        <div
          className="font-mono-cine text-xs tracking-[0.4em] text-dim mb-4"
          style={{ animation: 'letter-reveal 0.6s ease forwards' }}
        >
          Hey dude !...
        </div>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#4a9eff]"
              style={{
                animation: `noir-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StormGlowProps {
  x: number;
  y: number;
  color?: string;
  size?: number;
}

/** Golden/electric atmospheric glow */
export const Spotlight = memo(function Spotlight({
  x,
  y,
  color = '#4a9eff',
  size = 400,
}: StormGlowProps) {
  return (
    <div
      className="storm-glow crimson-pulse"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
});

interface ParticlesProps {
  count?: number;
  className?: string;
}

/** Floating dust/embers — golden and ash, very few, slow float */
export const Particles = memo(function Particles({ count = 8, className = '' }: ParticlesProps) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
      isEmber: Math.random() > 0.3,
    })), [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.12,
            background: p.isEmber ? '#4a9eff' : '#1a2a4a',
            boxShadow: p.isEmber
              ? '0 0 3px rgba(74, 158, 255, 0.2)'
              : '0 0 2px rgba(26, 42, 74, 0.15)',
            animation: `noir-pulse ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
});

export function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-12 bg-gradient-to-r from-[#0a1a3a] to-transparent" />
      <span className="scene-label text-[#4a9eff]/60">{title}</span>
    </div>
  );
}
