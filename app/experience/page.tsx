import { experiences } from "@/lib/content";

export default function ExperiencePage() {
  return (
    <div className="w-full space-y-8 px-6 md:px-16 max-w-5xl mx-auto py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
        <p className="max-w-2xl text-sm text-muted">
          A resume-style view of my professional background with room to attach
          project case studies and generalized documentation over time.
        </p>
      </header>

      <section className="space-y-6">
        {experiences.map((exp) => (
          <article
            key={`${exp.company}-${exp.title}-${exp.start}`}
            className="relative rounded-xl border border-white/10 bg-surface p-4 text-sm md:p-5"
          >
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  {exp.title}
                </h2>
                <p className="text-xs text-muted">{exp.company}</p>
              </div>
              <div className="text-xs text-muted md:text-right">
                <p>{exp.timelineLabel}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-muted">
              {exp.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted">
              Project writeups coming soon – this section is designed to link to
              deeper case studies in the Projects area.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
