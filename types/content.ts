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
};

export type Experience = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string | null;
  timelineLabel: string;
  highlights: string[];
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

