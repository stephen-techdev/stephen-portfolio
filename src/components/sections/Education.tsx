import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { education } from '@/data/portfolio';

const icons = [GraduationCap, BookOpen];

export function EducationSection() {
  return (
    <section
      id="education"
      className="world-section bg-world-midnight"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #060810, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '25%', top: '25%', width: '400px', height: '400px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '20%', bottom: '30%', width: '350px', height: '350px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '50%' }} />

      <Spotlight x={50} y={30} color="#4a9eff" size={400} />
      <Particles count={8} />

      <div className="relative z-10 max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="EDUCATION" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-16"
        >
          EDUCATION
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {education.map((item, i) => {
            const Icon = icons[i] || GraduationCap;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                className="flex"
              >
                <div className="glass-panel p-6 md:p-8 group hover:border-[#1a2a4a] transition-all duration-500 flex flex-col w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center group-hover:border-[#1a2a4a] transition-colors flex-shrink-0">
                      <Icon size={20} className="text-[#4a9eff]" />
                    </div>
                    <span
                      className={`text-xs font-mono-cine px-3 py-1 border rounded-sm tracking-widest ${
                        item.status === 'CURRENTLY PURSUING'
                          ? 'border-[#0e1220] text-[#4a9eff]'
                          : 'border-[#0e1220] text-dim'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-cinematic text-xl md:text-2xl text-white tracking-wide mb-2 leading-tight">
                    {item.degree}
                  </h3>
                  <p className="text-sm text-silver mb-3 font-light">
                    {item.institution}
                  </p>

                  <div className="flex-1" />

                  <p className="text-lg font-mono-cine text-[#4a9eff] tracking-wide">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
