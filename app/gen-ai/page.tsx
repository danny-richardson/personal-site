import { genAi } from "@/lib/content";

export default function GenAiPage() {
  return (
    <div className="w-full space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Gen AI & LLMs</h1>
        <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
          How I use generative AI and large language models to accelerate data
          science, experimentation, and decision-making workflows.
        </p>
      </header>

      <section className="space-y-4">
        <p className="max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
          {genAi.intro}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {genAi.pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <h2 className="text-sm font-semibold tracking-tight">
              {pillar.title}
            </h2>
            <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300">
              {pillar.description}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-zinc-700 dark:text-zinc-300">
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
        <ul className="flex flex-wrap gap-2 text-[11px] text-zinc-700 dark:text-zinc-300">
          {genAi.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

