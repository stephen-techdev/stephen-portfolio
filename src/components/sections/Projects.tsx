import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { projects } from '@/data/portfolio';
import type { Project } from '@/data/portfolio';

function ProjectSlide({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="project-tag">PROJECT 0{index + 1}</span>
          </div>

          <div>
            <motion.h3
              className="font-cinematic project-title text-white text-glow tracking-wide mb-2"
            >
              {project.name}
            </motion.h3>
            <p className="text-sm md:text-base text-[#4a9eff] font-mono-cine tracking-[0.15em]">
              {project.subtitle}
            </p>
          </div>

          <p className="text-silver text-sm md:text-base leading-relaxed font-light max-w-xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-[10px] md:text-xs font-mono-cine px-2.5 py-1 border border-[#0e1220] text-dim rounded-sm hover:border-[#1a2a4a] hover:text-silver transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinematic btn-accent group"
              >
                LIVE DEMO
                <ExternalLink size={15} className="transition-transform group-hover:scale-110" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinematic group"
              >
                <Github size={15} />
                GITHUB
              </a>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0a0e1a]/20 to-transparent" />

          <div className="scene-label mb-4">KEY FEATURES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                className="flex items-start gap-2 text-xs md:text-sm text-dim hover:text-silver transition-colors"
              >
                <Check size={12} className="text-[#4a9eff] mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section
      id="projects"
      className="world-section bg-world-waves"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #060810, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '15%', top: '25%', width: '500px', height: '500px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '20%', bottom: '20%', width: '400px', height: '400px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '40%' }} />

      <Spotlight x={30} y={40} color="#4a9eff" size={400} />
      <Spotlight x={70} y={60} color="#4a9eff" size={300} />
      <Particles count={10} />

      <div className="relative z-10 max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <SectionLabel title="PROJECTS" />

        <div className="flex items-end justify-between mb-8 md:mb-12 gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-cinematic section-heading text-white text-glow tracking-wide"
          >
            PROJECTS
          </motion.h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setActiveProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
              }
              className="w-10 h-10 rounded-sm border border-[#0e1220] flex items-center justify-center text-dim hover:text-white hover:border-[#1a2a4a] transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-mono-cine text-xs text-dim">
              {String(activeProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button
              onClick={() =>
                setActiveProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
              }
              className="w-10 h-10 rounded-sm border border-[#0e1220] flex items-center justify-center text-dim hover:text-white hover:border-[#1a2a4a] transition-all"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[300px] md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <ProjectSlide
              key={projects[activeProject].id}
              project={projects[activeProject]}
              index={activeProject}
            />
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-8 md:mt-12 justify-center flex-wrap">
          {projects.map((project, i) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(i)}
              className="group flex items-center gap-2"
            >
              <div
                className={`h-px transition-all duration-500 ${
                  activeProject === i
                    ? 'w-12 sm:w-20 bg-[#4a9eff]'
                    : 'w-8 sm:w-10 bg-[#0e1220] group-hover:bg-[#1a2a4a]'
                }`}
              />
              <span
                className={`font-mono-cine text-[10px] tracking-widest transition-colors ${
                  activeProject === i ? 'text-white' : 'text-dim group-hover:text-silver'
                }`}
              >
                {project.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
