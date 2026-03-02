import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import genAiData from "@/content/genai.json";

import type { About, Experience, GenAiContent, Project } from "@/types/content";

export const about: About = aboutData as About;

export const experiences: Experience[] = experienceData as Experience[];

export const projects: Project[] = projectsData as Project[];

export const genAi: GenAiContent = genAiData as GenAiContent;

