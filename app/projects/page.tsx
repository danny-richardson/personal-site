import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="w-full space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
          Case-study style summaries of analytics, tooling, and experimentation
          work. Some are directly tied to roles in my experience; others will
          evolve into standalone personal and Gen AI projects.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-tight">
                {project.title}
              </h2>
              <p className="text-xs text-zinc-500">{project.roleContext}</p>
            </div>
            <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300">
              {project.summary}
            </p>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Problem
              </h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                {project.problem}
              </p>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Approach
              </h3>
              <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-700 dark:text-zinc-300">
                {project.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Outcomes
              </h3>
              <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-700 dark:text-zinc-300">
                {project.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

