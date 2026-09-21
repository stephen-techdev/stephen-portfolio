import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navSections } from '@/data/portfolio';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Refs to avoid recreating the scroll listener on every state change
  const scrolledRef = useRef(false);
  const activeRef = useRef('hero');
  const sectionRefs = useRef<{ id: string; el: HTMLElement | null }[]>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    const refreshSections = () => {
      sectionRefs.current = navSections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));
    };
    refreshSections();
    window.addEventListener('resize', refreshSections);
    // Re-resolve after fonts/images shift layout
    const t = window.setTimeout(refreshSections, 1000);
    return () => {
      window.removeEventListener('resize', refreshSections);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;

        const newScrolled = scrollTop > 100;
        if (newScrolled !== scrolledRef.current) {
          scrolledRef.current = newScrolled;
          setScrolled(newScrolled);
        }

        const scrollPos = scrollTop + window.innerHeight / 2;
        let newActive = activeRef.current;

        for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
          const entry = sectionRefs.current[i];
          if (entry.el && entry.el.offsetTop <= scrollPos) {
            newActive = entry.id;
            break;
          }
        }

        if (newActive !== activeRef.current) {
          activeRef.current = newActive;
          setActiveSection(newActive);
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const NAV_OFFSET = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-500 ${
          scrolled ? 'bg-[#04060c]/80 backdrop-blur-md border-b border-[#0a0e1a]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-end md:justify-center">
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative px-2 lg:px-3 py-2 text-[10px] lg:text-xs font-mono-cine tracking-widest transition-colors duration-300 ${
                  activeSection === section.id
                    ? 'text-white'
                    : 'text-dim hover:text-silver'
                }`}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-[#4a9eff] to-transparent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-silver p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-[#04060c]/95 backdrop-blur-lg border-t border-[#0a0e1a]"
            >
              <div className="flex flex-col py-4 px-6 gap-1">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left py-3 px-2 text-sm font-mono-cine tracking-widest transition-colors ${
                      activeSection === section.id
                        ? 'text-white border-l-2 border-[#4a9eff] pl-4'
                        : 'text-dim hover:text-silver'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Side progress indicator */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-[8000] flex-col gap-2">
        {navSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center gap-3 justify-end"
          >
            <span
              className={`text-[10px] font-mono-cine tracking-widest transition-all duration-300 ${
                activeSection === section.id
                  ? 'text-white opacity-100'
                  : 'text-dim opacity-0 group-hover:opacity-60'
              }`}
            >
              {section.label}
            </span>
            <div
              className={`transition-all duration-300 ${
                activeSection === section.id
                  ? 'w-8 h-px bg-[#4a9eff]'
                  : 'w-4 h-px bg-[#0e1220] group-hover:bg-[#1a2a4a]'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
