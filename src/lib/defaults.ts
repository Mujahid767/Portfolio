import type { Portfolio } from './types';

export const defaultPortfolio: Portfolio = {
  brand: 'M.',
  photoUrl: '/profile.png',
  hero: {
    greeting: 'Hello, I am',
    name: 'Tohidur Rahman Mujahid',
    titles: [
      'AI Engineer',
      'Full-Stack Developer',
      'RAG / LLM Specialist',
      'Problem Solver',
    ],
    tagline:
      'Computer Science student at BRAC University crafting AI-powered, production-grade applications with a deep love for elegant systems and intelligent design.',
    resumeUrl: '',
    available: true,
  },
  about: {
    intro:
      'Engineer by mind. Designer by instinct. Builder by passion.',
    paragraphs: [
      "I'm a Computer Science Engineering student at BRAC University, with a strong foundation in Data Structures & Algorithms, Object-Oriented Programming, and database systems.",
      "I specialize in developing AI-powered applications — especially RAG-based systems built on top of modern LLMs. From low-level algorithms to large language models, I love working across the full intelligence stack.",
      "I have shipped a real-world production project for a Swedish company and built complex full-stack platforms with Next.js and PostgreSQL. I'm always exploring how to make software smarter, faster and more delightful.",
    ],
    location: 'Dhaka, Bangladesh',
    focus: 'AI · LLMs · Full-Stack',
  },
  stats: {
    codechefStars: 2,
    codechefRating: '2★ Coder',
    yearsCoding: 4,
    projectsBuilt: 12,
    technologies: 18,
  },
  skillCategories: [
    {
      id: 'ai',
      title: 'AI / ML',
      position: 0,
      skills: [
        'RAG Systems',
        'LangChain',
        'LlamaIndex',
        'OpenAI / GPT',
        'Vector DBs',
        'Embeddings',
        'Prompt Engineering',
        'Agents',
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend',
      position: 1,
      skills: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion',
        'shadcn/ui',
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      position: 2,
      skills: [
        'Node.js',
        'Express',
        'PostgreSQL',
        'Prisma',
        'REST APIs',
        'Authentication',
        'Drizzle',
      ],
    },
    {
      id: 'cs',
      title: 'Computer Science',
      position: 3,
      skills: [
        'Data Structures',
        'Algorithms',
        'OOP',
        'Database Systems',
        'System Design',
        'Competitive Programming',
      ],
    },
    {
      id: 'tools',
      title: 'Tools & Languages',
      position: 4,
      skills: [
        'Python',
        'JavaScript',
        'C / C++',
        'Java',
        'Git & GitHub',
        'Linux',
        'Docker',
      ],
    },
  ],
  projects: [
    {
      id: 'political-platform',
      title: 'National Party Management Platform',
      description:
        'Secure, transparent platform for managing party operations, 300 parliamentary constituencies, cabinet voting, MP meetings and fund transparency. Built with Next.js + PostgreSQL with role-based access for Admin, Chairman, Minister, MP and Public users.',
      tags: ['Next.js', 'PostgreSQL', 'TypeScript', 'Tailwind', 'Auth'],
      link: 'https://political-party-platform.vercel.app/login',
      highlight: true,
      year: '2025',
      role: 'Full-Stack Engineer',
      position: 0,
    },
    {
      id: 'mobility-partner',
      title: 'MobilityPartner — Sweden',
      description:
        'Production project for a Swedish mobility company. Worked on a real-world platform serving customers across Sweden, focusing on reliability, performance and clean engineering.',
      tags: ['Production', 'Web Platform', 'Real Client'],
      link: 'https://development.mobilitypartner.se/',
      highlight: true,
      year: '2025',
      role: 'Developer',
      position: 1,
    },
    {
      id: 'rag-assistant',
      title: 'RAG Knowledge Assistant',
      description:
        'A retrieval-augmented chat assistant over private documents — semantic search with embeddings, vector store, and LLM-powered answers grounded in source citations.',
      tags: ['RAG', 'LLM', 'Vector DB', 'Python'],
      link: '#',
      year: '2025',
      role: 'AI Engineer',
      position: 2,
    },
  ],
  experiences: [
    {
      id: 'exp-mobility',
      title: 'Software Developer',
      org: 'MobilityPartner (Sweden)',
      period: '2025 — Present',
      description:
        'Contributing to a production web platform serving Swedish mobility customers. Working on full-stack features, performance optimization and reliable shipping.',
      position: 0,
    },
    {
      id: 'exp-freelance',
      title: 'Freelance Full-Stack & AI Developer',
      org: 'Independent',
      period: '2024 — Present',
      description:
        'Building AI-powered web platforms with Next.js and PostgreSQL. Designing RAG systems and LLM integrations for clients.',
      position: 1,
    },
  ],
  education: [
    {
      id: 'edu-brac',
      degree: 'B.Sc. in Computer Science & Engineering',
      school: 'BRAC University',
      period: 'Ongoing',
      detail:
        'Focus on AI, Data Structures & Algorithms, OOP, Databases and System Design.',
      position: 0,
    },
  ],
  achievements: [
    {
      id: 'ach-codechef',
      title: '2★ Coder on CodeChef',
      detail: 'Active competitive programmer on CodeChef solving algorithmic challenges.',
      icon: 'star',
      position: 0,
    },
    {
      id: 'ach-production',
      title: 'Shipped Production Software',
      detail: 'Delivered a live production project for a real client based in Sweden.',
      icon: 'rocket',
      position: 1,
    },
    {
      id: 'ach-platform',
      title: 'Built a National-Scale Platform',
      detail: 'Architected a multi-role political party management system end-to-end.',
      icon: 'crown',
      position: 2,
    },
  ],
  certificates: [
    {
      id: 'cert-data-science',
      title: 'The Ultimate Job Ready Data Science Course',
      issuer: 'CodeWithHarry',
      date: 'September 14, 2025',
      credentialId: 'CWH-THE-ULTIMATE-JOB-READY-DATA-SCIENCE-COURSE-8XKL8HJZ',
      imageUrl: '/cert-data-science.png',
      link: 'https://www.codewithharry.com',
      position: 0,
    },
    {
      id: 'cert-fullstack',
      title: 'Delta — Full Stack Web Development',
      issuer: 'Apna College',
      date: '',
      credentialId: '68f9031d8382ee066c018577',
      imageUrl: '/cert-fullstack.png',
      link: '',
      position: 1,
    },
  ],
  social: {
    github: 'https://github.com/Mujahid767',
    linkedin: 'https://www.linkedin.com/in/tohidur-rahman-mujahid-8755b6280/',
    facebook: 'https://www.facebook.com/muju1433016/',
    codechef: 'https://www.codechef.com/users/avid_scene_94',
    email: 'mailto:mujahid@example.com',
  },
};
