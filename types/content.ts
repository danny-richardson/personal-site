export type About = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  focusAreas: string[];
  education: {
    degree: string;
    school: string;
    highlights?: string[];
  }[];
  links: {
    linkedin: string;
  };
  // Optional long-form personal essay for the About section
  essay?: string[];
};

export type Experience = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string | null;
  timelineLabel: string;
  highlights: string[];
  // Single condensed line describing the core of the role
  tagline?: string;
};

export type Project = {
  slug: string;
  title: string;
  roleContext: string;
  summary: string;
  problem: string;
  approach: string[];
  outcomes: string[];
  tags: string[];
  experienceSlugs?: string[];
};

export type GenAiPillar = {
  title: string;
  description: string;
  examples: string[];
};

export type GenAiContent = {
  intro: string;
  pillars: GenAiPillar[];
  skills: string[];
};

export type Hero = {
  name: string;
  oneLiner: string;
  bio: string;
  location: string;
  ctas: {
    label: string;
    href: string;
  }[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  roleContext: string;
  problem: string;
  insight: string;
  approach: string;
  impact: string;
  metrics: string[];
};

export type StackDomain = {
  title: string;
  perspective: string;
  projectAnchor: string;
  outcome: string;
};

export type ImpactStat = {
  label: string;
  value: string;
  description: string;
};

