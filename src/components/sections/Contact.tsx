import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Send } from 'lucide-react';
import { SectionLabel, Particles, Spotlight } from '@/components/Cinematic';
import { CinematicBackground } from '@/components/CinematicBackground';
import { contact } from '@/data/portfolio';

export function ContactSection() {
  return (
    <section
      id="contact"
      className="world-section bg-world-calm"
    >
      <div className="section-blend-top" style={{ background: 'linear-gradient(to bottom, #060810, transparent)' }} />
      <div className="noise-overlay" />
      <CinematicBackground className="z-0" />

      <div className="storm-glow" style={{ left: '20%', top: '25%', width: '450px', height: '450px', background: '#0a0e1a' }} />
      <div className="storm-glow" style={{ right: '20%', bottom: '20%', width: '400px', height: '400px', background: '#080a14' }} />
      <div className="fog-layer" style={{ top: '40%' }} />

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#0a0e1a] opacity-10 blur-[50px] z-[1] pointer-events-none contact-glow-a"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#080a14] opacity-10 blur-[50px] z-[1] pointer-events-none contact-glow-b"
      />

      <Spotlight x={50} y={40} color="#4a9eff" size={400} />
      <Particles count={15} />

      <div className="relative z-10 max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <SectionLabel title="CONTACT" />

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-cinematic text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white text-glow tracking-wide mb-6"
        >
          LET'S BUILD SOMETHING.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-silver text-sm md:text-base lg:text-lg font-light italic mb-10 md:mb-16"
        >
          EVERY GREAT PROJECT STARTS WITH AN IDEA.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 md:mb-12 text-left">
          <motion.a
            href={`mailto:${contact.email}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-4 md:p-5 group hover:border-[#1a2a4a] transition-all"
          >
            <Mail size={18} className="text-silver mb-3 group-hover:text-white transition-colors" />
            <div className="scene-label mb-1">EMAIL</div>
            <p className="text-sm text-silver break-all">{contact.email}</p>
          </motion.a>

          <motion.a
            href={`tel:${contact.phone}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-panel p-4 md:p-5 group hover:border-[#1a2a4a] transition-all"
          >
            <Phone size={18} className="text-silver mb-3 group-hover:text-white transition-colors" />
            <div className="scene-label mb-1">PHONE</div>
            <p className="text-sm text-silver">{contact.phone}</p>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-panel p-4 md:p-5"
          >
            <MapPin size={18} className="text-silver mb-3" />
            <div className="scene-label mb-1">LOCATION</div>
            <p className="text-sm text-silver">{contact.location}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cinematic group w-full sm:w-auto"
          >
            <Linkedin size={16} />
            LINKEDIN
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cinematic group w-full sm:w-auto"
          >
            <Github size={16} />
            GITHUB
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="btn-cinematic btn-accent group w-full sm:w-auto"
          >
            <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
            EMAIL ME
          </a>
        </motion.div>
      </div>
    </section>
  );
}
