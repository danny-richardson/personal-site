import { about } from "@/lib/content";

export default function AboutPage() {
  return (
    <div className="w-full space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {about.headline}
        </p>
        <p className="text-xs text-zinc-500">{about.location}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {about.summary}
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Focus areas</h2>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {about.focusAreas.map((area) => (
              <li key={area} className="flex gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="text-sm font-semibold tracking-tight">Education</h2>
          <ul className="space-y-3">
            {about.education.map((edu) => (
              <li key={edu.degree}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-xs text-zinc-500">{edu.school}</p>
                {edu.highlights && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-400">
                    {edu.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a
              href={about.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-medium text-zinc-800 underline-offset-2 hover:underline dark:text-zinc-200"
            >
              View full profile on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

