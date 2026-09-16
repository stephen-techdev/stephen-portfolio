import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { finalSequence } from '@/data/portfolio';

export function FinalScene() {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (sequenceIndex < finalSequence.length) {
      const timer = setTimeout(() => {
        setSequenceIndex((prev) => prev + 1);
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowFooter(true), 500);
      return () => clearTimeout(timer);
    }
  }, [sequenceIndex]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="final"
      className="world-section bg-world-horizon"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #04060c, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <Spotlight x={50} y={30} color="#4a9eff" size={500} />
      <Spotlight x={50} y={70} color="#4a9eff" size={300} />
      <Particles count={20} />

      {/* Fog and atmospheric glows */}
      <div className="fog-layer" style={{ top: '30%' }} />
      <div className="storm-glow" style={{ left: '20%', top: '20%', width: '500px', height: '500px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '20%', bottom: '15%', width: '400px', height: '400px', background: '#080a14' }} />

      {/* Subtle ocean horizon glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(26,42,74,0.15) 0%, transparent 100%)',
      }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {sequenceIndex < finalSequence.length && (
            <motion.div
              key={sequenceIndex}
              initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(20px)' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className={`font-cinematic tracking-wide ${
                  sequenceIndex === finalSequence.length - 1
                    ? 'final-heading text-white text-glow'
                    : 'final-sub text-silver text-glow'
                }`}
              >
                {finalSequence[sequenceIndex]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showFooter && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8 mt-8"
          >
            {/* Closing quote */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(15px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="space-y-2"
            >
              <p className="font-cinematic footer-quote text-silver tracking-wide leading-relaxed">
                EVERY LINE OF CODE IS A STEP FORWARD.
              </p>
              <p className="font-cinematic footer-quote text-silver tracking-wide leading-relaxed">
                EVERY IDEA IS A CHANCE TO BUILD SOMETHING NEW.
              </p>
            </motion.div>

            {/* Subtle separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#1a2a4a] to-transparent"
            />

            {/* Keep building message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="font-cinematic footer-sub text-[#4a9eff] tracking-[0.3em]"
            >
              KEEP BUILDING. KEEP EXPLORING.
            </motion.p>

            {/* Back to top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <button
                onClick={scrollToTop}
                className="btn-cinematic btn-accent group mx-auto"
              >
                <ArrowUp
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                BACK TO TOP
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
