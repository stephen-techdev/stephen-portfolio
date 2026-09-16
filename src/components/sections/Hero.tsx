import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ExternalLink, FileText, FileBadge, ImagePlus } from 'lucide-react';
import { HeroScene } from '@/components/three/HeroScene';
import { CinematicBackground } from '@/components/CinematicBackground';
import { Particles, Spotlight } from '@/components/Cinematic';
import { DocumentViewer } from '@/components/DocumentViewer';
import { personal, heroIntro } from '@/data/portfolio';
import { useOwner } from '@/lib/owner-context';

const introVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(15px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -30, filter: 'blur(15px)' },
};

export function HeroSection() {
  const [introIndex, setIntroIndex] = useState(0);
  const [showName, setShowName] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const { files, isOwner } = useOwner();

  useEffect(() => {
    if (introIndex < heroIntro.length) {
      const timer = setTimeout(() => {
        setIntroIndex((prev) => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowName(true), 400);
      return () => clearTimeout(timer);
    }
  }, [introIndex]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const photoUrl = files.photo?.url;
  const resumeUrl = files.resume?.url ?? null;
  const resumeName = files.resume?.file_name ?? null;
  const cvUrl = files.cv?.url ?? null;
  const cvName = files.cv?.file_name ?? null;

  return (
    <section
      id="hero"
      className="world-section bg-world-base"
    >
      {/* Atmospheric layers */}
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      {/* Storm scene — CSS forest silhouettes, clouds, crimson glow */}
      <div className="absolute inset-0 z-[1] opacity-70">
        <HeroScene />
      </div>

      {/* Fog layers */}
      <div className="fog-layer" style={{ top: '20%' }} />
      <div className="fog-layer" style={{ top: '60%', animationDelay: '5s' }} />

      {/* Atmospheric glows — crimson and charcoal */}
      <div className="storm-glow" style={{ left: '15%', top: '15%', width: '500px', height: '500px', background: '#1a2a4a' }} />
      <div className="storm-glow" style={{ right: '10%', bottom: '15%', width: '400px', height: '400px', background: '#0a0e1a' }} />

      {/* Electric ember glows */}
      <Spotlight x={30} y={30} color="#4a9eff" size={400} />
      <Spotlight x={70} y={60} color="#2a5a8a" size={300} />

      <Particles count={8} />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16">
          {/* Left: text content */}
          <div className="flex-1 text-center lg:text-left">
            <AnimatePresence mode="wait">
              {!showName && introIndex < heroIntro.length && (
                <motion.div
                  key={introIndex}
                  variants={introVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cinematic hero-intro text-silver text-glow tracking-wide"
                >
                  {heroIntro[introIndex]}
                </motion.div>
              )}
            </AnimatePresence>

            {showName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cinematic hero-name text-white text-glow tracking-wider mb-6"
                >
                  {personal.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="font-mono-cine hero-tagline text-[#4a9eff] tracking-[0.2em] mb-6 max-w-md mx-auto lg:mx-0"
                >
                  CODE THE UNKNOWN. CREATE THE UNEXPECTED.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="space-y-2 mb-8"
                >
                  {personal.roles.map((role, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.15, duration: 0.6 }}
                      className={`font-mono-cine text-xs sm:text-sm md:text-base tracking-[0.2em] ${
                        i === personal.roles.length - 1 ? 'text-[#4a9eff]' : 'text-silver'
                      }`}
                    >
                      {role}
                    </motion.p>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center"
                >
                  <button
                    onClick={() => scrollToSection('about')}
                    className="btn-cinematic group"
                  >
                    ENTER MY WORLD
                    <ArrowDown
                      size={16}
                      className="transition-transform group-hover:translate-y-0.5"
                    />
                  </button>
                  <button
                    onClick={() => scrollToSection('projects')}
                    className="btn-cinematic btn-accent group"
                  >
                    VIEW PROJECTS
                    <ExternalLink
                      size={16}
                      className="transition-transform group-hover:scale-110"
                    />
                  </button>
                </motion.div>

                {/* Resume & CV buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mt-4"
                >
                  <button
                    onClick={() => setResumeOpen(true)}
                    className="btn-cinematic group text-sm px-5 py-2.5"
                  >
                    <FileText size={15} className="text-[#4a9eff]" />
                    VIEW RESUME
                  </button>
                  <button
                    onClick={() => setCvOpen(true)}
                    className="btn-cinematic group text-sm px-5 py-2.5"
                  >
                    <FileBadge size={15} className="text-[#4a9eff]" />
                    VIEW CV
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Right: professional photo */}
          {showName && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex-shrink-0 mt-8 lg:mt-0"
            >
              <HeroPhoto photoUrl={photoUrl} isOwner={isOwner} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator — atmospheric pulsing glow */}
      {showName && (
        <ScrollIndicator />
      )}

      <DocumentViewer
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="RESUME"
        fileUrl={resumeUrl}
        fileName={resumeName}
        fileType="resume"
      />
      <DocumentViewer
        open={cvOpen}
        onClose={() => setCvOpen(false)}
        title="CV"
        fileUrl={cvUrl}
        fileName={cvName}
        fileType="cv"
      />
    </section>
  );
}

function HeroPhoto({ photoUrl, isOwner }: { photoUrl?: string; isOwner: boolean }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  if (!photoUrl || imgError) {
    return (
      <div className="relative w-[clamp(240px,30vw,400px)] aspect-[3/4]">
        <div
          className="relative overflow-hidden w-full h-full"
          style={{
            border: '1px solid rgba(74, 158, 255, 0.15)',
            borderRadius: '2px',
          }}
        >
          {/* Gradient border glow */}
          <div
            className="absolute -inset-px pointer-events-none"
            style={{
              background:
              'linear-gradient(135deg, rgba(74,158,255,0.1) 0%, transparent 30%, transparent 70%, rgba(26,42,74,0.06) 100%)',
              borderRadius: '2px',
            }}
          />

          {/* No-photo state — elegant, not a placeholder box */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#060810] to-[#04060c]">
            <div className="w-20 h-20 rounded-full border border-[#0e1220] flex items-center justify-center mb-4">
              <ImagePlus size={32} className="text-[#1a2a4a]" />
            </div>
            {isOwner ? (
              <span className="text-[10px] font-mono-cine tracking-[0.2em] text-[#4a9eff]">
                + ADD PHOTO
              </span>
            ) : (
              <span className="text-[10px] font-mono-cine tracking-[0.2em] text-[#1a2a4a]">
                PROFESSIONAL PORTRAIT
              </span>
            )}
          </div>

          {/* Cinematic overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#04060c]/60 via-transparent to-transparent" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#04060c]/30 to-transparent" />
        </div>
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-px w-2/3"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(74,158,255,0.25), transparent)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-[clamp(240px,30vw,400px)] aspect-[3/4]">
      <div
        className="relative overflow-hidden w-full h-full"
        style={{
          border: '1px solid rgba(74, 158, 255, 0.12)',
          borderRadius: '2px',
        }}
      >
        <div
          className="absolute -inset-px pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(74,158,255,0.08) 0%, transparent 30%, transparent 70%, rgba(42,90,138,0.05) 100%)',
            borderRadius: '2px',
          }}
        />
        <img
          src={photoUrl}
          alt="Stephen K — Professional Portrait"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#04060c]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#04060c]/30 to-transparent" />
        {/* Film grain on photo */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }} />
      </div>
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-px w-2/3"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(74,158,255,0.25), transparent)',
        }}
      />
    </div>
  );
}

function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
    >
      <motion.div
        animate={visible ? { y: [0, 8, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono-cine tracking-[0.3em] text-dim">
          SCROLL
        </span>
        <div className="relative">
          <div className="w-px h-12 bg-gradient-to-b from-[#0a1a3a] to-transparent" />
          <motion.div
            animate={visible ? { opacity: [0.3, 0.8, 0.3] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4a9eff]"
            style={{ filter: 'blur(2px)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
