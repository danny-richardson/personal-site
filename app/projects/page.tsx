import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="w-full space-y-8 px-6 md:px-16 max-w-5xl mx-auto py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-2xl text-sm text-muted">
          Case-study style summaries of analytics, tooling, and experimentation
          work. Some are directly tied to roles in my experience; others will
          evolve into standalone personal and Gen AI projects.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-xl border border-white/10 bg-surface p-4 text-sm"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-tight">
                {project.title}
              </h2>
              <p className="text-xs text-muted">{project.roleContext}</p>
            </div>
            <p className="mt-2 text-xs text-muted">{project.summary}</p>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Problem
              </h3>
              <p className="text-xs text-muted">{project.problem}</p>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Approach
              </h3>
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted">
                {project.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Outcomes
              </h3>
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted">
                {project.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-2 border border-white/10 px-2 py-1 text-[10px] text-muted"
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
