import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { skills } from '@/data/portfolio';

interface SkillGroup {
  title: string;
  items: string[];
}

const skillGroups: SkillGroup[] = [
  { title: 'LANGUAGES', items: skills.languages },
  { title: 'FRONTEND', items: skills.frontend },
  { title: 'DATABASE & BACKEND', items: skills.database },
  { title: 'DEVELOPMENT TOOLS', items: skills.tools },
  { title: 'PRODUCTIVITY', items: skills.productivity },
];

export function SkillsSection() {
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <section
      id="skills"
      className="world-section bg-world-deep"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #04060c, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '20%', top: '20%', width: '500px', height: '500px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '15%', bottom: '25%', width: '400px', height: '400px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '50%' }} />

      <Spotlight x={50} y={50} color="#4a9eff" size={500} />
      <Particles count={8} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="SKILLS" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-12"
        >
          SKILLS
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onMouseEnter={() => setActiveGroup(i)}
              className={`glass-panel p-4 md:p-5 transition-all duration-500 cursor-default ${
                activeGroup === i ? 'border-[#1a2a4a] bg-[#060810]/80' : ''
              }`}
            >
              <div
                className={`scene-label mb-4 transition-colors ${
                  activeGroup === i ? 'text-[#4a9eff]' : ''
                }`}
              >
                {group.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill, j) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + j * 0.05, duration: 0.4 }}
                    className={`text-xs md:text-sm px-3 py-1.5 rounded-sm border transition-all duration-300 ${
                      activeGroup === i
                        ? 'border-[#1a2a4a] text-white bg-[#0a0e1a]'
                        : 'border-[#0e1220] text-dim bg-transparent'
                    }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
