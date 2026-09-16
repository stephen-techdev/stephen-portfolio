export const personal = {
  name: 'STEPHEN K',
  fullName: 'Stephen K',
  roles: [
    'COMPUTER TECHNOLOGY STUDENT',
    'FULL-STACK WEB DEVELOPER',
    'BUILDING IDEAS INTO DIGITAL EXPERIENCES',
  ],
  about: {
    paragraphs: [
      'Stephen K is a Computer Technology student with hands-on experience building web applications and full-stack projects.',
      'He has practical experience working with modern web technologies and enjoys transforming ideas into functional digital products.',
      'He is a quick learner with strong problem-solving and analytical skills.',
    ],
    focusAreas: [
      'Building projects independently',
      'Learning modern technologies',
      'Improving technical skills',
      'Exploring artificial intelligence',
      'Creating useful digital experiences',
    ],
    quote: ['LEARNING FAST.', 'BUILDING INDEPENDENTLY.', 'TURNING IDEAS INTO WORKING EXPERIENCES.'],
  },
};

export const heroIntro = [
  'EVERY STORY STARTS SOMEWHERE.',
  'MINE STARTED WITH CURIOSITY.',
  'AND CONTINUES WITH CODE.',
];

export const skills = {
  languages: ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL'],
  frontend: ['React.js', 'Tailwind CSS'],
  database: ['Supabase', 'PostgreSQL', 'REST APIs'],
  tools: ['Git', 'GitHub', 'Visual Studio Code', 'Vercel'],
  productivity: ['Microsoft Excel'],
};

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tech: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  visualStyle: string;
}

export const projects: Project[] = [
  {
    id: 'anime-zoon',
    name: 'ANIME ZOON',
    subtitle: 'ANIME DISCOVERY & COMMUNITY PLATFORM',
    description:
      'Developed a responsive full-stack anime discovery platform featuring categorized content browsing and detailed anime listing pages.',
    tech: ['React.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel', 'GitHub'],
    features: [
      'Anime discovery',
      'Categorized browsing',
      'Detailed anime information',
      'User authentication',
      'User profile management',
      'Secure user management',
      'Report Issue feature',
      'User feedback system',
      'Bug reporting',
      'Admin dashboard',
      'Anime content management',
      'User management',
      'Report management',
      'Application settings management',
    ],
    liveUrl: 'https://animezoon-love.vercel.app',
    githubUrl: 'https://github.com/stephen862k7-byte/AnimeZoon',
    visualStyle: 'entertainment database',
  },
  {
    id: 'presento-ai',
    name: 'PREZENTO AI',
    subtitle: 'AI-POWERED PRESENTATION GENERATOR',
    description:
      'Prezento AI is an AI-powered presentation generator designed to transform user topics and prompts into structured presentations.',
    tech: [
      'React.js',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'React Router',
      'Next.js API',
      'Node.js Runtime',
      'OpenRouter AI Integration',
      'REST APIs',
      'Vercel',
      'Render',
      'Visual Studio Code',
    ],
    features: [
      'AI presentation generation',
      'Slide structure creation',
      'Slide title generation',
      'Sections and bullet points',
      'Logical presentation flow',
      'Summaries',
      'Speaker notes',
      'Image suggestions',
      'Themes',
      'Layouts',
      'AI-powered slide editing',
      'Presentation customization',
      'Export functionality',
    ],
    liveUrl: 'https://prezento-two.vercel.app/',
    githubStyle: 'AI command center',
    visualStyle: 'AI command center',
  } as Project,
];

export interface ExperienceItem {
  title: string;
  organization: string;
  period: string;
  details: string[];
}

export const experience: ExperienceItem[] = [
  {
    title: 'FRONTEND DEVELOPMENT INTERN',
    organization: 'INFO TECH COMPANY',
    period: '15-DAY INTERNSHIP',
    details: [
      'Completed practical frontend development training focused on HTML, CSS, and JavaScript.',
      'Worked on hands-on web page components and practical frontend development.',
    ],
  },
  {
    title: 'ARTIFICIAL INTELLIGENCE TRAINEE',
    organization: 'IBM SKILLBUILD',
    period: 'TRAINING PROGRAM',
    details: [
      'Gained foundational knowledge in Artificial Intelligence, AI concepts, and core AI components.',
    ],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  detail: string;
  status: string;
}

export const education: EducationItem[] = [
  {
    degree: 'BACHELOR OF SCIENCE IN COMPUTER TECHNOLOGY',
    institution: 'Nandha Arts and Science College',
    detail: 'CGPA: 8.5',
    status: 'CURRENTLY PURSUING',
  },
  {
    degree: 'HIGHER SECONDARY EDUCATION',
    institution: 'S.E.T. Higher Secondary School',
    detail: 'Percentage: 90%',
    status: 'COMPLETED',
  },
];

export interface Achievement {
  category: string;
  items: string[];
}

export const achievements: Achievement[] = [
  {
    category: 'STATE-LEVEL WRESTLING',
    items: [
      'Gold Medalist',
      'Silver Medalist',
      'Bronze Medalist',
      'Best Attacker Award',
    ],
  },
  {
    category: 'KABADDI',
    items: ['Zonal-Level Winner', 'District-Level Participant'],
  },
  {
    category: 'OVERALL SPORTS DAY CHAMPION',
    items: ['Champion Title'],
  },
];

export const disciplineQuote = [
  'DISCIPLINE LEARNED IN SPORT.',
  'FOCUS APPLIED TO TECHNOLOGY.',
];

export interface Certification {
  title: string;
  issuer: string;
}

export const certifications: Certification[] = [
  { title: 'GOOGLE STUDENT AMBASSADOR PROGRAM', issuer: 'Google' },
  { title: 'JOURNEY TO CLOUD: ENVISIONING YOUR SOLUTION', issuer: 'IBM SkillBuild' },
  { title: 'GETTING STARTED WITH ARTIFICIAL INTELLIGENCE', issuer: 'IBM SkillBuild' },
];

export const interests = [
  'Volunteering in Social Activities',
  'Continuous Learning',
  'Exploring New Technologies',
  'Learning New Skills',
];

export const contact = {
  email: 'Stephen862k7@gmail.com',
  phone: '9345125667',
  location: 'Erode, Tamil Nadu, India',
  linkedin: 'https://www.linkedin.com/in/stephen-techdev',
  github: 'https://github.com/stephen-techdev',
};

export const finalSequence = [
  'THANK YOU FOR VISITING.',
  'THE NEXT PROJECT STARTS HERE.',
];

export const navSections = [
  { id: 'hero', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'learning', label: 'LEARNING' },
  { id: 'contact', label: 'CONTACT' },
];
