import Image from "next/image";
import Link from "next/link";
import {
  about,
  caseStudies,
  experiences,
  hero,
  impactStats,
  stackDomains,
} from "@/lib/content";

export default function Home() {
  const condensedExperience = experiences;

  return (
    <div className="space-y-16 md:space-y-20">
      {/* Hero */}
      <section
        id="home"
        className="section-shell noise-hero rounded-3xl border border-neutral-200 bg-white/80 px-6 py-8 shadow-sm md:px-10 md:py-12"
      >
        <div className="flex flex-col items-center gap-6 md:items-start md:gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start md:gap-5">
            <div className="h-32 w-32 overflow-hidden rounded-full border border-neutral-300 shadow-sm md:h-40 md:w-40">
              <Image
                src="/profile.jpg"
                alt="Headshot of Daniel Richardson"
                width={160}
                height={160}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Data Science · AI Systems · Agentic Workflows
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {hero.name}
            </h1>
            <p className="text-sm font-medium text-neutral-700">
              {hero.oneLiner}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
              {hero.bio}
            </p>
            <p className="text-xs text-neutral-500">{hero.location}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              {hero.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section id="work" className="section-shell space-y-6">
        <header className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight">Featured work</h2>
          <p className="max-w-2xl text-sm text-neutral-700">
            Three systems that started as ambiguous problems and ended as
            production products with real numbers behind them.
          </p>
        </header>
        <div className="space-y-6">
          {caseStudies.map((cs) => (
            <article
              key={cs.slug}
              className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 text-sm shadow-sm md:px-8 md:py-7"
            >
              <header className="space-y-1">
                <h3 className="font-display text-xl tracking-tight">
                  {cs.title}
                </h3>
                <p className="text-xs text-neutral-500">{cs.roleContext}</p>
              </header>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <SectionLabel>Problem</SectionLabel>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {cs.problem}
                  </p>
                  <SectionLabel>Insight</SectionLabel>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {cs.insight}
                  </p>
                </div>
                <div className="space-y-3">
                  <SectionLabel>Approach</SectionLabel>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {cs.approach}
                  </p>
                  <SectionLabel>Impact</SectionLabel>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {cs.impact}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-[11px] text-accent">
                    {cs.metrics.map((m) => (
                      <li key={m} className="rounded-full bg-accent/5 px-3 py-1">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Stack in practice */}
      <section id="stack" className="section-shell space-y-6">
        <header className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight">
            The stack in practice
          </h2>
          <p className="max-w-2xl text-sm text-neutral-700">
            How I think about the building blocks of AI systems — and where they
            show up in production work.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {stackDomains.map((domain) => (
            <article
              key={domain.title}
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm shadow-sm"
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {domain.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-700">
                {domain.perspective}
              </p>
              <p className="mt-2 text-[11px] italic text-neutral-600">
                {domain.projectAnchor}
              </p>
              <p className="mt-2 text-xs text-accent">{domain.outcome}</p>
            </article>
          ))}
        </div>
        <div className="border-l border-dashed border-neutral-300 pl-4 text-[11px] text-neutral-600">
          <p>
            Currently exploring: multi-agent orchestration patterns, MCP
            protocol design, and compound AI system evaluation.{" "}
            <span className="text-neutral-500">
              Last updated {new Date().toLocaleDateString()}.
            </span>
          </p>
        </div>
      </section>

      {/* Impact strip */}
      <section
        id="impact"
        className="section-shell rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm md:px-8 md:py-7"
      >
        <h2 className="font-display text-xl tracking-tight">Impact at a glance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {impactStats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm font-semibold text-accent">{stat.value}</p>
              <p className="text-xs font-medium text-neutral-800">
                {stat.label}
              </p>
              <p className="text-[11px] text-neutral-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About essay */}
      <section id="about" className="section-shell space-y-4">
        <header className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight">About</h2>
          <p className="max-w-2xl text-sm text-neutral-700">
            The path, the philosophy, and the arc from where I started to the
            problems I am working on now.
          </p>
        </header>
        <div className="space-y-3 text-sm leading-relaxed text-neutral-800">
          {(about.essay ?? []).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="section-shell space-y-4">
        <header className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight">Education</h2>
          <p className="max-w-2xl text-sm text-neutral-700">
            The formal training that underpins how I design and ship AI systems.
          </p>
        </header>
        <div className="space-y-3">
          {about.education.map((edu) => (
            <article
              key={`${edu.degree}-${edu.school}`}
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm shadow-sm"
            >
              <p className="text-sm font-semibold tracking-tight">
                {edu.degree}
              </p>
              <p className="text-xs text-neutral-600">{edu.school}</p>
              {edu.highlights && (
                <ul className="mt-2 list-disc pl-4 text-xs text-neutral-700">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section id="experience" className="section-shell space-y-4">
        <header className="space-y-2">
          <h2 className="font-display text-2xl tracking-tight">Experience</h2>
          <p className="max-w-2xl text-sm text-neutral-700">
            A condensed view of the roles where I learned to design, ship, and
            scale AI systems.
          </p>
        </header>
        <div className="space-y-4">
          {condensedExperience.map((exp) => (
            <article
              key={`${exp.company}-${exp.title}-${exp.start}`}
              className="border-b border-dashed border-neutral-200 pb-4 last:border-b-0"
            >
              <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    {exp.title}
                  </p>
                  <p className="text-xs text-neutral-600">{exp.company}</p>
                </div>
                <div className="text-xs text-neutral-500 md:text-right">
                  <p>{exp.timelineLabel}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              {exp.tagline && (
                <p className="mt-2 text-xs text-neutral-700">{exp.tagline}</p>
              )}
            </article>
          ))}
        </div>
        <p className="text-[11px] text-neutral-600">
          For full role details and earlier experience, see{" "}
          <a
            href={about.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>

      {/* Connect */}
      <section id="connect" className="section-shell space-y-3 pb-4">
        <h2 className="font-display text-2xl tracking-tight">Connect</h2>
        <p className="max-w-xl text-sm text-neutral-700">
          I am always interested in hard problems and the people working on
          them. If you are exploring something in this space and think my way of
          working could help, I would be glad to talk.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-800">
          <a
            href="mailto:daniel.rey.richardson@gmail.com"
            className="underline underline-offset-2"
          >
            daniel.rey.richardson@gmail.com
          </a>
          <a
            href={about.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-neutral-800 text-[9px] font-semibold text-white">
              in
            </span>
            <span>LinkedIn</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      {children}
    </p>
  );
}
