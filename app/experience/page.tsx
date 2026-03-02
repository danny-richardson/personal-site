import { experiences } from "@/lib/content";

export default function ExperiencePage() {
  return (
    <div className="w-full space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
        <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
          A resume-style view of my professional background with room to attach
          project case studies and generalized documentation over time.
        </p>
      </header>

      <section className="space-y-6">
        {experiences.map((exp) => (
          <article
            key={`${exp.company}-${exp.title}-${exp.start}`}
            className="relative rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60 md:p-5"
          >
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  {exp.title}
                </h2>
                <p className="text-xs text-zinc-500">{exp.company}</p>
              </div>
              <div className="text-xs text-zinc-500 md:text-right">
                <p>{exp.timelineLabel}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-zinc-700 dark:text-zinc-300">
              {exp.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-zinc-500">
              Project writeups coming soon – this section is designed to link to
              deeper case studies in the Projects area.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

