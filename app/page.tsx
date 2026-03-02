import Link from "next/link";
import { about, experiences, projects, genAi } from "@/lib/content";

export default function Home() {
  const currentRole = experiences[0];
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="flex w-full flex-col gap-10 md:flex-row">
      <section className="flex-1 space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Data Science · Analytics · Gen AI
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {about.name}
        </h1>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {about.headline} · {about.location}
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {about.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {about.focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {area}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/experience"
            className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-black"
          >
            View experience
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Explore projects
          </Link>
          <Link
            href="/gen-ai"
            className="inline-flex items-center rounded-full border border-dashed border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Gen AI fluency
          </Link>
        </div>
      </section>

      <section className="flex-1 space-y-6 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        {currentRole && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Current role
            </h2>
            <p className="font-medium">
              {currentRole.title} · {currentRole.company}
            </p>
            <p className="text-xs text-zinc-500">
              {currentRole.timelineLabel} · {currentRole.location}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-700 dark:text-zinc-300">
              {currentRole.highlights.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href="/experience"
              className="mt-2 inline-flex text-xs font-medium text-zinc-800 underline-offset-2 hover:underline dark:text-zinc-200"
            >
              See full experience →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Selected work
          </h2>
          <div className="space-y-3">
            {featuredProjects.map((project) => (
              <div
                key={project.slug}
                className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <p className="text-xs font-semibold">{project.title}</p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  {project.roleContext}
                </p>
                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {project.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Gen AI focus
          </h2>
          <p className="text-xs text-zinc-700 dark:text-zinc-300">
            {genAi.intro}
          </p>
        </div>
      </section>
    </div>
  );
}

