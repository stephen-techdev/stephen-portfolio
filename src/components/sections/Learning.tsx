import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, Users, Telescope, Sparkles } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { certifications, interests } from '@/data/portfolio';

const interestIcons = [Users, BookOpen, Telescope, Sparkles];

export function LearningSection() {
  return (
    <section
      id="learning"
      className="world-section bg-world-deep"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #04060c, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '20%', top: '30%', width: '400px', height: '400px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '25%', bottom: '25%', width: '350px', height: '350px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '45%' }} />

      <Spotlight x={40} y={40} color="#4a9eff" size={400} />
      <Particles count={10} />

      <div className="relative z-10 max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="LEARNING" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-12"
        >
          CONTINUOUS LEARNING
        </motion.h2>

        <div className="space-y-3 md:space-y-4 mb-12 md:mb-20">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="glass-panel p-4 md:p-6 flex items-center gap-4 md:gap-6 group hover:border-[#1a2a4a] transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center flex-shrink-0 group-hover:border-[#1a2a4a] transition-colors">
                <Award size={24} className="text-silver" />
              </div>

              <div className="flex-1">
                <h3 className="font-cinematic text-lg md:text-xl text-white tracking-wide leading-tight mb-1">
                  {cert.title}
                </h3>
                <p className="text-sm text-[#4a9eff] font-mono-cine tracking-[0.1em]">
                  {cert.issuer}
                </p>
              </div>

              <div className="hidden sm:block text-[10px] font-mono-cine text-dim tracking-widest">
                CREDENTIAL 0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-cinematic text-xl md:text-2xl lg:text-3xl text-white tracking-wide mb-6 md:mb-8">
            OUTSIDE THE CODE
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {interests.map((interest, i) => {
              const Icon = interestIcons[i] || Heart;
              return (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-panel p-5 text-center group hover:border-[#1a2a4a] transition-all duration-500"
                >
                  <div className="w-10 h-10 mx-auto rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center mb-3 group-hover:border-[#1a2a4a] transition-colors">
                    <Icon size={16} className="text-silver" />
                  </div>
                  <p className="text-xs md:text-sm text-dim group-hover:text-silver transition-colors leading-tight">
                    {interest}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
