import { useRef, memo, useMemo } from 'react';

/**
 * Lightweight CSS-only thunder/supernatural atmosphere for the hero.
 * Dark forest silhouettes, storm clouds, distant golden glow, rain.
 * No WebGL, no rAF loop — pure CSS transforms and opacity.
 */
export const HeroScene = memo(function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Distant window/structure lights — very few
  const distantLights = useMemo(() => {
    return [
      { left: 15, top: 35, w: 2, h: 2, delay: 0 },
      { left: 22, top: 28, w: 2, h: 2, delay: 3 },
      { left: 78, top: 32, w: 2, h: 2, delay: 1 },
      { left: 85, top: 25, w: 2, h: 2, delay: 5 },
      { left: 68, top: 38, w: 2, h: 2, delay: 7 },
    ];
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Stormy night sky — dark clouds */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 5%, rgba(26, 22, 8, 0.5) 0%, transparent 50%), radial-gradient(ellipse 80% 30% at 30% 0%, rgba(14, 12, 8, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 25% at 70% 5%, rgba(26, 42, 74, 0.04) 0%, transparent 50%)',
        }}
      />

      {/* Slow drifting cloud layer */}
      <div
        className="cloud-layer"
        style={{
          top: '0%',
          background: 'radial-gradient(ellipse 70% 35% at 40% 50%, rgba(20, 18, 8, 0.2) 0%, transparent 60%)',
        }}
      />
      <div
        className="cloud-layer"
        style={{
          top: '8%',
          animationDuration: '180s',
          background: 'radial-gradient(ellipse 60% 30% at 65% 50%, rgba(14, 12, 8, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Distant forest/tree silhouettes — left */}
      <div
        className="absolute bottom-0"
        style={{
          left: '0%',
          width: '35%',
          height: '45%',
          background: 'linear-gradient(to top, #04060c 0%, #060810 80%, transparent 100%)',
          clipPath: 'polygon(0 100%, 0 70%, 5% 55%, 8% 65%, 12% 40%, 15% 50%, 18% 35%, 22% 45%, 25% 30%, 28% 40%, 32% 50%, 35% 45%, 35% 100%)',
        }}
      />

      {/* Distant forest/tree silhouettes — right */}
      <div
        className="absolute bottom-0"
        style={{
          right: '0%',
          width: '40%',
          height: '50%',
          background: 'linear-gradient(to top, #04060c 0%, #060810 75%, transparent 100%)',
          clipPath: 'polygon(100% 100%, 100% 60%, 95% 45%, 90% 55%, 85% 35%, 80% 48%, 75% 30%, 70% 42%, 65% 25%, 60% 38%, 55% 50%, 50% 45%, 45% 55%, 40% 48%, 35% 100%)',
        }}
      />

      {/* Distant structure silhouette — center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '120px',
          height: '80px',
          background: '#04060c',
          opacity: 0.6,
          clipPath: 'polygon(0 100%, 0 60%, 20% 60%, 20% 40%, 30% 40%, 30% 30%, 50% 20%, 70% 30%, 70% 40%, 80% 40%, 80% 60%, 100% 60%, 100% 100%)',
        }}
      />

      {/* Golden atmospheric glow — behind clouds */}
      <div
        className="absolute crimson-pulse"
        style={{
          left: '50%',
          top: '10%',
          width: '600px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(26, 42, 74, 0.08) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Distant lights — tiny ember points */}
      {distantLights.map((light, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${light.left}%`,
            top: `${light.top}%`,
            width: `${light.w}px`,
            height: `${light.h}px`,
            background: '#4a9eff',
            opacity: 0.15,
            boxShadow: '0 0 4px rgba(74, 158, 255, 0.3)',
            animation: `noir-pulse ${10 + light.delay}s ease-in-out ${light.delay}s infinite`,
          }}
        />
      ))}

      {/* Wet ground reflection at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '20%',
          background: 'linear-gradient(to top, rgba(26, 42, 74, 0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});
