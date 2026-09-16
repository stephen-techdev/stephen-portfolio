import { motion } from 'framer-motion';
import { Briefcase, Cpu, ChevronRight } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { experience } from '@/data/portfolio';

const icons = [Briefcase, Cpu];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="world-section bg-world-cliff"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #060810, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '20%', top: '30%', width: '450px', height: '450px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '25%', bottom: '25%', width: '350px', height: '350px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '30%' }} />
      <div className="fog-layer" style={{ top: '60%' }} />

      <Spotlight x={20} y={50} color="#4a9eff" size={400} />
      <Particles count={8} />

      <div className="relative z-10 max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="EXPERIENCE" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cinematic section-heading text-white text-glow tracking-wide mb-10 md:mb-16"
        >
          EXPERIENCE
        </motion.h2>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#0e1220] to-transparent" />

          <div className="space-y-8 md:space-y-12">
            {experience.map((item, i) => {
              const Icon = icons[i] || Briefcase;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  className="relative md:grid md:grid-cols-2 md:gap-0"
                >
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-[#4a9eff] ring-4 ring-[#04060c]" />
                  </div>

                  {isLeft ? (
                    <>
                      <div className="md:pr-10 lg:pr-12 pl-12 md:pl-0">
                        <ExperienceCard item={item} icon={Icon} />
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="md:pl-10 lg:pl-12 pl-12">
                        <ExperienceCard item={item} icon={Icon} />
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExperienceCardProps {
  item: typeof experience[0];
  icon: typeof Briefcase;
}

function ExperienceCard({ item, icon: Icon }: ExperienceCardProps) {
  return (
    <div className="glass-panel p-5 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-sm bg-[#060810] border border-[#0e1220] flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-[#4a9eff]" />
        </div>
        <span className="project-tag">{item.period}</span>
      </div>

      <h3 className="font-cinematic text-xl md:text-2xl text-white tracking-wide mb-1 text-left">
        {item.title}
      </h3>
      <p className="text-sm text-[#4a9eff] font-mono-cine tracking-[0.1em] mb-4 text-left">
        {item.organization}
      </p>

      <div className="space-y-2">
        {item.details.map((detail, j) => (
          <div
            key={j}
            className="flex items-start gap-2 text-sm text-dim"
          >
            <ChevronRight size={14} className="text-[#4a9eff] mt-0.5 flex-shrink-0" />
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
