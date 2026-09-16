import { useRef, memo, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinematicBackgroundProps {
  className?: string;
}

/**
 * Thunder/supernatural atmosphere: storm clouds, fog, rain, drifting mist.
 * All effects are CSS-only with minimal DOM nodes. Parallax is only
 * mounted when the section is near the viewport.
 */
export const CinematicBackground = memo(function CinematicBackground({
  className = '',
}: CinematicBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  const rainDrops = useMemo(() => {
    const count = window.innerWidth < 768 ? 12 : 25;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 0.8 + 1.2,
      delay: Math.random() * 3,
      height: window.innerWidth < 768 ? 35 : 50,
    }));
  }, []);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Slow drifting storm clouds — parallax */}
      {near && (
        <motion.div style={{ y }} className="absolute inset-0">
          <div
            className="cloud-layer"
            style={{
              top: '5%',
              background: 'radial-gradient(ellipse 60% 30% at 30% 50%, rgba(14, 11, 13, 0.15) 0%, transparent 60%)',
            }}
          />
          <div
            className="cloud-layer"
            style={{
              top: '15%',
              animationDuration: '150s',
              background: 'radial-gradient(ellipse 50% 25% at 70% 50%, rgba(20, 16, 18, 0.12) 0%, transparent 60%)',
            }}
          />
        </motion.div>
      )}

      {/* Rain — CSS-animated, lightweight */}
      {near && (
        <div className="storm-rain">
          {rainDrops.map((drop) => (
            <span
              key={drop.id}
              style={{
                left: `${drop.left}%`,
                height: `${drop.height}px`,
                animationDuration: `${drop.duration}s`,
                animationDelay: `${drop.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
