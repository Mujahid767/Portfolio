export type SocialLinks = {
  github: string;
  linkedin: string;
  facebook: string;
  codechef: string;
  email: string;
  twitter?: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  skills: string[];
  position: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  source?: string;
  highlight?: boolean;
  year?: string;
  role?: string;
  position: number;
};

export type Experience = {
  id: string;
  title: string;
  org: string;
  period: string;
  description: string;
  position: number;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
  detail?: string;
  position: number;
};

export type Achievement = {
  id: string;
  title: string;
  detail: string;
  icon?: string;
  position: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  imageUrl: string;
  link?: string;
  position: number;
};

export type Stats = {
  codechefStars: number;
  codechefRating?: string;
  yearsCoding: number;
  projectsBuilt: number;
  technologies: number;
};

export type Hero = {
  greeting: string;
  name: string;
  titles: string[];
  tagline: string;
  resumeUrl?: string;
  available: boolean;
};

export type About = {
  intro: string;
  paragraphs: string[];
  location: string;
  focus: string;
};

export type Portfolio = {
  hero: Hero;
  about: About;
  stats: Stats;
  skillCategories: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
  certificates: Certificate[];
  social: SocialLinks;
  photoUrl: string;
  brand: string;
};
