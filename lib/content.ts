import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import genAiData from "@/content/genai.json";
import heroData from "@/content/hero.json";
import caseStudiesData from "@/content/case-studies.json";
import stackData from "@/content/stack.json";
import impactData from "@/content/impact.json";

import type {
  About,
  CaseStudy,
  Experience,
  GenAiContent,
  Hero,
  ImpactStat,
  Project,
  StackDomain,
} from "@/types/content";

export const about: About = aboutData as About;

export const experiences: Experience[] = experienceData as Experience[];

export const projects: Project[] = projectsData as Project[];

export const genAi: GenAiContent = genAiData as GenAiContent;

export const hero: Hero = heroData as Hero;

export const caseStudies: CaseStudy[] = caseStudiesData as CaseStudy[];

export const stackDomains: StackDomain[] = stackData as StackDomain[];

export const impactStats: ImpactStat[] = impactData as ImpactStat[];

