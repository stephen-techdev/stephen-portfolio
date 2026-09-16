import { motion } from 'framer-motion';
import { Code2, Brain, Sparkles, Target } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { personal } from '@/data/portfolio';

const focusIcons = [Code2, Brain, Sparkles, Target, Code2];

export function AboutSection() {
  return (
    <section
      id="about"
      className="world-section bg-world-mist"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #04060c, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '10%', top: '30%', width: '450px', height: '450px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '15%', bottom: '20%', width: '350px', height: '350px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '40%' }} />

      <Spotlight x={30} y={40} color="#4a9eff" size={400} />
      <Spotlight x={70} y={60} color="#4a9eff" size={250} />
      <Particles count={10} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="ABOUT" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-12"
        >
          THE DEVELOPER BEHIND THE CODE
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            {personal.about.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="text-silver text-sm md:text-base lg:text-lg leading-relaxed font-light"
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-6 space-y-3"
            >
              {personal.about.quote.map((line, i) => (
                <p
                  key={i}
                  className="font-cinematic text-lg md:text-xl lg:text-2xl text-white tracking-wide"
                >
                  {line}
                </p>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-6 md:p-8 space-y-4"
          >
            <div className="scene-label mb-6">FOCUS AREAS</div>
            {personal.about.focusAreas.map((area, i) => {
              const Icon = focusIcons[i] || Code2;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center group-hover:border-[#1a2a4a] transition-colors">
                    <Icon size={16} className="text-[#4a9eff]" />
                  </div>
                  <span className="text-sm md:text-base text-silver group-hover:text-white transition-colors">
                    {area}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
