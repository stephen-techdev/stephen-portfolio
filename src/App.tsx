import { useState } from 'react';
import { FilmGrain, LoadingScreen } from '@/components/Cinematic';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/About';
import { SkillsSection } from '@/components/sections/Skills';
import { ProjectsSection } from '@/components/sections/Projects';
import { ExperienceSection } from '@/components/sections/Experience';
import { EducationSection } from '@/components/sections/Education';
import { AchievementsSection } from '@/components/sections/Achievements';
import { LearningSection } from '@/components/sections/Learning';
import { ContactSection } from '@/components/sections/Contact';
import { FinalScene } from '@/components/sections/FinalScene';
import { EditButton } from '@/components/EditButton';
import { OwnerProvider } from '@/lib/owner-context';
import { useVisibilityPause } from '@/lib/use-in-view';

function App() {
  const [loading, setLoading] = useState(true);
  useVisibilityPause();

  return (
    <OwnerProvider>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <FilmGrain />
      <div className="world-fog" />
      <Navbar />

      <main className="relative bg-world-base">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <AchievementsSection />
        <LearningSection />
        <ContactSection />
        <FinalScene />
      </main>

      <EditButton />
    </OwnerProvider>
  );
}

export default App;
