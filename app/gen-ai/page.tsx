import { genAi } from "@/lib/content";

export default function GenAiPage() {
  return (
    <div className="w-full space-y-8 px-6 md:px-16 max-w-5xl mx-auto py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Gen AI & LLMs</h1>
        <p className="max-w-2xl text-sm text-muted">
          How I use generative AI and large language models to accelerate data
          science, experimentation, and decision-making workflows.
        </p>
      </header>

      <section className="space-y-4">
        <p className="max-w-3xl text-sm text-muted">{genAi.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {genAi.pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col rounded-xl border border-white/10 bg-surface p-4 text-sm"
          >
            <h2 className="text-sm font-semibold tracking-tight">{pillar.title}</h2>
            <p className="mt-2 text-xs text-muted">{pillar.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted">
              {pillar.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">
          How this shows up in my work
        </h2>
        <ul className="flex flex-wrap gap-2 text-[11px] text-muted">
          {genAi.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-surface-2 border border-white/10 px-3 py-1"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
