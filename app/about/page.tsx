import { about } from "@/lib/content";

export default function AboutPage() {
  return (
    <div className="w-full space-y-8 px-6 md:px-16 max-w-5xl mx-auto py-12">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">{about.headline}</h1>
        <p className="text-xs label-mono text-muted">{about.location}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {about.summary}
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Focus areas</h2>
          <ul className="space-y-2 text-sm text-muted">
            {about.focusAreas.map((area) => (
              <li key={area} className="flex gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-surface p-4 text-sm">
          <h2 className="text-sm font-semibold tracking-tight">Education</h2>
          <ul className="space-y-3">
            {about.education.map((edu) => (
              <li key={edu.degree}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-xs text-muted">{edu.school}</p>
                {edu.highlights && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-muted">
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
              className="inline-flex text-xs font-medium text-foreground underline-offset-2 hover:underline"
            >
              View full profile on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
