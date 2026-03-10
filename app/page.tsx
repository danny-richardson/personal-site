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
import { AnimateIn } from "@/app/components/animate-in";
import { CountUp } from "@/app/components/count-up";

export default function Home() {
  const bioLines = hero.bioLines ?? (hero.bio ? [hero.bio] : []);

  return (
    <div className="space-y-16 md:space-y-20">
      {/* Hero */}
      <section
        id="home"
        className="section-shell noise-hero relative rounded-3xl border border-neutral-200 bg-white/80 px-6 py-8 shadow-sm md:px-10 md:py-12"
      >
        {/* Accent stripe */}
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-accent via-accent/70 to-transparent" />

        <div className="flex flex-col items-center gap-6 pt-2 md:items-start md:gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start md:gap-5">
            <div className="hero-enter h-32 w-32 overflow-hidden rounded-full border-2 border-accent/20 shadow-sm md:h-40 md:w-40">
              <Image
                src="/profile.jpg"
                alt="Headshot of Daniel Richardson"
                width={160}
                height={160}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            <p className="hero-enter hero-delay-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent/80">
              Data Science · Agentic AI · Systems Builder
            </p>
            <h1 className="hero-enter hero-delay-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {hero.name}
            </h1>
            <p className="hero-enter hero-delay-3 text-sm font-semibold text-neutral-800">
              {hero.oneLiner}
            </p>
            <div className="hero-enter hero-delay-4 max-w-xl space-y-3">
              {bioLines.map((line, i) => (
                <p key={i} className="text-sm leading-relaxed text-neutral-700">
                  {line}
                </p>
              ))}
            </div>
            <p className="hero-enter hero-delay-5 font-mono text-[11px] text-neutral-400 tracking-wide">
              {hero.location}
            </p>
            <div className="hero-enter hero-delay-6 flex flex-wrap gap-3 pt-1">
              {hero.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-700 hover:shadow-md"
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
        <AnimateIn>
          <header className="space-y-2">
            <SectionHeading marker="01">Featured work</SectionHeading>
            <p className="max-w-2xl text-sm text-neutral-700">
              Three systems that started as ambiguous problems and ended as
              production products with real numbers behind them.
            </p>
          </header>
        </AnimateIn>
        <div className="space-y-6">
          {caseStudies.map((cs, i) => (
            <AnimateIn key={cs.slug} delay={i * 100}>
              <article className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:px-8 md:py-7">
                <header className="space-y-1">
                  <h3 className="font-display text-xl tracking-tight">
                    {cs.title}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    {cs.roleContext}
                  </p>
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
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {cs.metrics.map((m) => (
                        <li
                          key={m}
                          className="font-mono rounded-full bg-accent/5 px-3 py-1 text-[10px] text-accent transition-colors duration-150 hover:bg-accent/10"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Stack in practice */}
      <section id="stack" className="section-shell space-y-6">
        <AnimateIn>
          <header className="space-y-2">
            <SectionHeading marker="02">The stack in practice</SectionHeading>
            <p className="max-w-2xl text-sm text-neutral-700">
              How I think about the building blocks of AI systems — and where they
              show up in production work.
            </p>
          </header>
        </AnimateIn>
        <div className="grid gap-4 md:grid-cols-2">
          {stackDomains.map((domain, i) => (
            <AnimateIn key={domain.title} delay={i * 80}>
              <article className="h-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md">
                <h3 className="text-sm font-semibold tracking-tight">
                  {domain.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-700">
                  {domain.perspective}
                </p>
                <p className="mt-2 text-[11px] italic text-neutral-500">
                  {domain.projectAnchor}
                </p>
                <p className="mt-2 font-mono text-[11px] text-accent">{domain.outcome}</p>
              </article>
            </AnimateIn>
          ))}
        </div>
        <AnimateIn>
          <div className="border-l-2 border-accent/30 pl-4 text-[11px] text-neutral-500">
            <p>
              Currently exploring: multi-agent orchestration patterns, MCP
              protocol design, and compound AI system evaluation.{" "}
              <span className="font-mono text-neutral-400">
                Updated {new Date().toLocaleDateString()}.
              </span>
            </p>
          </div>
        </AnimateIn>
      </section>

      {/* Impact strip */}
      <AnimateIn>
        <section
          id="impact"
          className="section-shell rounded-3xl border border-accent/20 bg-accent/[0.03] px-6 py-6 shadow-sm md:px-8 md:py-8"
        >
          <SectionHeading marker="03">Impact at a glance</SectionHeading>
          <div className="mt-5 grid gap-5 md:grid-cols-3 md:gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-mono text-base font-medium text-accent">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-xs font-semibold text-neutral-800">
                  {stat.label}
                </p>
                <p className="text-[11px] leading-relaxed text-neutral-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* About essay */}
      <section id="about" className="section-shell space-y-4">
        <AnimateIn>
          <header className="space-y-2">
            <SectionHeading marker="04">About</SectionHeading>
            <p className="max-w-2xl text-sm text-neutral-700">
              The path, the philosophy, and the arc from where I started to the
              problems I am working on now.
            </p>
          </header>
        </AnimateIn>
        <AnimateIn delay={80}>
          <div className="space-y-4 text-sm leading-relaxed text-neutral-700">
            {(about.essay ?? []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </AnimateIn>
      </section>

      {/* Education */}
      <section id="education" className="section-shell space-y-4">
        <AnimateIn>
          <header className="space-y-2">
            <SectionHeading marker="05">Education</SectionHeading>
            <p className="max-w-2xl text-sm text-neutral-700">
              The formal training that underpins how I design and ship AI systems.
            </p>
          </header>
        </AnimateIn>
        <div className="space-y-3">
          {about.education.map((edu, i) => (
            <AnimateIn key={`${edu.degree}-${edu.school}`} delay={i * 80}>
              <article className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-sm font-semibold tracking-tight">
                  {edu.degree}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-0.5">
                  {edu.school}
                </p>
                {edu.highlights && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-neutral-600 space-y-0.5">
                    {edu.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </article>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section id="experience" className="section-shell space-y-4">
        <AnimateIn>
          <header className="space-y-2">
            <SectionHeading marker="06">Experience</SectionHeading>
            <p className="max-w-2xl text-sm text-neutral-700">
              A condensed view of the roles where I learned to design, ship, and
              scale AI systems.
            </p>
          </header>
        </AnimateIn>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <AnimateIn key={`${exp.company}-${exp.title}-${exp.start}`} delay={i * 60}>
              <article className="border-b border-dashed border-neutral-200 pb-4 last:border-b-0">
                <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">
                      {exp.title}
                    </p>
                    <p className="text-xs text-neutral-500">{exp.company}</p>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 md:text-right">
                    <p>{exp.timelineLabel}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {exp.tagline && (
                  <p className="mt-2 text-xs text-neutral-600">{exp.tagline}</p>
                )}
              </article>
            </AnimateIn>
          ))}
        </div>
        <AnimateIn>
          <p className="text-[11px] text-neutral-400">
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
        </AnimateIn>
      </section>

      {/* Connect */}
      <AnimateIn>
        <section id="connect" className="section-shell space-y-3 pb-4">
          <SectionHeading marker="07">Connect</SectionHeading>
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
      </AnimateIn>
    </div>
  );
}

function SectionHeading({
  marker,
  children,
}: {
  marker: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-baseline gap-2.5 font-display text-2xl tracking-tight">
      <span className="font-mono text-[11px] font-medium text-accent/60 translate-y-[-1px]">
        {marker} /
      </span>
      {children}
    </h2>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
      {children}
    </p>
  );
}
