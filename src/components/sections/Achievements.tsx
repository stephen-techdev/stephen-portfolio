import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { achievements, disciplineQuote } from '@/data/portfolio';

const categoryIcons = [Trophy, Medal, Crown];

const medalColors: Record<string, string> = {
  'Gold Medalist': 'text-yellow-600',
  'Silver Medalist': 'text-gray-400',
  'Bronze Medalist': 'text-orange-800',
  'Best Attacker Award': 'text-[#4a9eff]',
  'Zonal-Level Winner': 'text-yellow-600',
  'District-Level Participant': 'text-gray-400',
  'Champion Title': 'text-yellow-600',
};

export function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="world-section bg-world-moon"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #060810, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '15%', top: '20%', width: '450px', height: '450px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '20%', bottom: '20%', width: '400px', height: '400px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '40%' }} />

      <Spotlight x={50} y={30} color="#4a9eff" size={500} />
      <Spotlight x={30} y={70} color="#4a9eff" size={300} />
      <Particles count={15} />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(74,158,255,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="ACHIEVEMENTS" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-12"
        >
          ACHIEVEMENTS
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {achievements.map((achievement, i) => {
            const Icon = categoryIcons[i] || Award;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="glass-panel p-5 md:p-6 group hover:border-[#1a2a4a] transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center group-hover:border-[#1a2a4a] transition-colors">
                    <Icon size={18} className="text-silver" />
                  </div>
                  <h3 className="font-cinematic text-base md:text-lg text-white tracking-wide leading-tight">
                    {achievement.category}
                  </h3>
                </div>

                <div className="space-y-2 pl-2">
                  {achievement.items.map((item, j) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15 + j * 0.08, duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <Medal
                        size={14}
                        className={medalColors[item] || 'text-dim'}
                      />
                      <span className="text-sm text-silver">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center py-8"
        >
          {disciplineQuote.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, filter: 'blur(15px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.3, duration: 1 }}
              className="font-cinematic discipline-quote text-white text-glow tracking-wide"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
