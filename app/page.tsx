import Image from "next/image";
import Link from "next/link";
import {
  about,
  caseStudies,
  experiences,
  hero,
  impactStats,
} from "@/lib/content";
import { AnimateIn } from "@/app/components/animate-in";
import { CountUp } from "@/app/components/count-up";
import { SectionHeading } from "@/app/components/section-heading";
import { TextReveal } from "@/app/components/text-reveal";
import { FractalTree } from "@/app/components/fractal-tree";

const characterBadges = [
  "Maker / Builder",
  "Explorer / Adventurer",
  "Thought Leader",
  "Mentor / Connector",
]

function SectionInner({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 md:px-16 max-w-5xl mx-auto ${className ?? ""}`}>{children}</div>;
}

export default function Home() {
  const pullQuotes = about.pullQuotes ?? [];

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section
        id="home"
        className="section-shell relative min-h-screen flex flex-col overflow-hidden"
      >
        <FractalTree className="z-0" />

        {/* Strong top vignette — keeps all text fully legible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,13,0.96) 0%, rgba(8,9,13,0.88) 28%, rgba(8,9,13,0.5) 48%, rgba(8,9,13,0.15) 60%, transparent 70%)",
          }}
        />

        {/* Centered hero text — all white, intentional spacing */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 pt-28 pb-0 w-full">
          <p className="hero-enter text-sm md:text-base text-foreground/70 mb-4 tracking-wide">
            Data Scientist | Intelligence Systems Builder | AI Engineer
          </p>
          <h1 className="hero-enter hero-delay-1 font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-tight mb-4 text-foreground">
            {hero.name}
          </h1>
          <div className="hero-enter hero-delay-2 flex flex-wrap gap-3 pt-7 justify-center">
            {hero.ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="inline-flex items-center border border-white/25 px-5 py-2 text-sm font-medium text-foreground tracking-wide transition-all duration-200 hover:border-accent hover:text-accent"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>

        {/* scroll hint — above the tree, not on top of it */}
        <p className="hero-enter hero-delay-6 absolute bottom-12 left-1/2 -translate-x-1/2 label-mono text-foreground/45 z-20 whitespace-nowrap">
          scroll to explore
        </p>
      </section>

      {/* ── About ──────────────────────────────────── */}
      <section id="about" className="section-shell py-24 md:py-32 bg-surface">
        <SectionInner className="space-y-8">
          <AnimateIn>
            <SectionHeading number="01">About</SectionHeading>
          </AnimateIn>

          {/* Profile photo identity block */}
          <AnimateIn delay={40}>
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src="/profile.jpg"
                  alt="Daniel Richardson"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              <div className="space-y-1">
                <p className="font-display text-xl md:text-2xl tracking-tight text-foreground">
                  {hero.name}
                </p>
                <p className="text-sm text-foreground/70">
                  Senior Data Scientist · Intelligence Systems Builder
                </p>
                <p className="label-mono text-muted">Pinterest · San Francisco, CA</p>
              </div>
            </div>
          </AnimateIn>

          {/* Pull quotes */}
          {pullQuotes.map((quote, i) => (
            <AnimateIn key={i} delay={i * 80}>
              <blockquote className="text-xl md:text-2xl font-display border-l-2 border-accent pl-5 text-foreground max-w-2xl">
                {quote}
              </blockquote>
            </AnimateIn>
          ))}

          {/* Bio essay */}
          <AnimateIn delay={100}>
            <div className="prose-muted text-sm leading-relaxed text-muted space-y-4 max-w-3xl">
              {(about.essay ?? []).map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </AnimateIn>

          {/* Character badges */}
          <AnimateIn delay={140}>
            <div className="flex flex-wrap gap-2">
              {characterBadges.map((badge) => (
                <span
                  key={badge}
                  className="label-mono border border-white/10 text-muted px-3 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>
          </AnimateIn>
        </SectionInner>
      </section>

      {/* ── Impact ─────────────────────────────────── */}
      <section id="impact" className="section-shell py-24 md:py-32 bg-background border-t-2 border-accent">
        <SectionInner>
          <AnimateIn>
            <SectionHeading number="02">Impact at a glance</SectionHeading>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {impactStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="font-display text-5xl md:text-6xl tracking-tight text-foreground">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="label-mono text-foreground mt-2">{stat.label}</p>
                  <p className="text-sm leading-relaxed text-muted">{stat.description}</p>
                </div>
              ))}
            </div>
          </AnimateIn>
        </SectionInner>
      </section>

      {/* ── Featured Work ──────────────────────────── */}
      <section id="work" className="section-shell py-24 md:py-32 bg-surface">
        <SectionInner className="space-y-8">
          <AnimateIn>
            <SectionHeading number="03">Featured work</SectionHeading>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Systems that started as ambiguous problems and ended as production
              products with real numbers behind them.
            </p>
          </AnimateIn>

          <div className="space-y-8">
            {caseStudies.map((cs, i) => (
              <AnimateIn key={cs.slug} delay={i * 100}>
                <article className="group relative border-l-4 border-transparent hover:border-accent transition-colors duration-300 pl-6">
                  <header className="md:grid md:grid-cols-[80px_1fr] md:gap-6 mb-4">
                    <span
                      aria-hidden="true"
                      className="hidden md:block font-display text-7xl leading-none text-foreground opacity-10 select-none"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl tracking-tight">
                        {cs.title}
                      </h3>
                      <p className="label-mono text-muted mt-1">{cs.roleContext}</p>
                    </div>
                  </header>

                  <div className="grid gap-4 md:grid-cols-2 md:pl-[calc(80px+1.5rem)]">
                    <div className="space-y-3">
                      <SectionLabel>Problem</SectionLabel>
                      <p className="text-sm leading-relaxed text-muted">{cs.problem}</p>
                      <SectionLabel>Insight</SectionLabel>
                      <p className="text-sm leading-relaxed text-muted">{cs.insight}</p>
                    </div>
                    <div className="space-y-3">
                      <SectionLabel>Approach</SectionLabel>
                      <p className="text-sm leading-relaxed text-muted">{cs.approach}</p>
                      <SectionLabel>Impact</SectionLabel>
                      <blockquote className="text-base font-display border-l-2 border-accent pl-4 my-2 text-foreground">
                        {cs.impact}
                      </blockquote>
                      <ul className="flex flex-wrap gap-2 mt-2">
                        {cs.metrics.map((m) => (
                          <li
                            key={m}
                            className="label-mono bg-surface-2 border border-white/10 px-3 py-1 text-foreground"
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
        </SectionInner>
      </section>

      {/* ── Experience ─────────────────────────────── */}
      <section id="experience" className="section-shell py-24 md:py-32 bg-surface">
        <SectionInner className="space-y-6">
          <AnimateIn>
            <SectionHeading number="04">Experience</SectionHeading>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              A condensed view of the roles where I learned to design, ship, and
              scale AI systems.
            </p>
          </AnimateIn>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <AnimateIn key={`${exp.company}-${exp.title}-${exp.start}`} delay={i * 60}>
                <article className="border-l border-dashed border-white/10 pl-6 md:grid md:grid-cols-[160px_1fr] md:gap-8">
                  <div className="mb-3 md:mb-0">
                    <p className="label-mono text-foreground/60">{exp.timelineLabel}</p>
                    <Image
                      src={exp.logoUrl ?? "/logos/placeholder.svg"}
                      alt={exp.company}
                      width={80}
                      height={32}
                      className="mt-2 opacity-90 object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-display text-lg tracking-tight text-foreground">{exp.title}</p>
                    <p className="text-sm text-foreground/70">{exp.company}</p>
                    {exp.tagline && (
                      <p className="mt-1 text-sm text-foreground/55 italic">{exp.tagline}</p>
                    )}
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn>
            <p className="label-mono text-muted">
              Full details at{" "}
              <a
                href={about.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                LinkedIn
              </a>
            </p>
          </AnimateIn>
        </SectionInner>
      </section>

      {/* ── Education ──────────────────────────────── */}
      <section id="education" className="section-shell py-24 md:py-32 bg-surface">
        <SectionInner className="space-y-6">
          <AnimateIn>
            <SectionHeading number="05">Education</SectionHeading>
            <p className="mt-3 max-w-2xl text-sm text-foreground/65">
              The formal training that underpins how I design and ship AI systems.
            </p>
          </AnimateIn>

          <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/10 space-y-6">
            {about.education.map((edu, i) => (
              <AnimateIn key={`${edu.degree}-${edu.school}`} delay={i * 80}>
                <article className="relative">
                  <span className="absolute -left-[2.125rem] top-1.5 w-2 h-2 rounded-full bg-accent" />
                  <p className="label-mono text-foreground/80 mb-1">{edu.school}</p>
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    {edu.degree}
                  </p>
                  {edu.highlights && (
                    <ul className="mt-2 space-y-1 text-xs text-foreground/65 list-disc pl-4">
                      {edu.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </AnimateIn>
            ))}
          </div>
        </SectionInner>
      </section>

      {/* ── Connect ────────────────────────────────── */}
      <section id="connect" className="section-shell py-24 md:py-32 bg-background">
        <SectionInner>
          <TextReveal as="h2" className="font-display text-5xl md:text-7xl tracking-tight leading-tight mb-6">
            {"Let's talk."}
          </TextReveal>
          <p className="label-mono text-muted mb-6">
            Hard problems · AI systems · Thoughtful collaboration
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="mailto:daniel.rey.richardson@gmail.com"
              className="relative text-sm text-foreground after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              daniel.rey.richardson@gmail.com
            </a>
            <a
              href={about.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center bg-foreground text-background text-[9px] font-semibold">
                in
              </span>
              LinkedIn
            </a>
          </div>
        </SectionInner>
      </section>

    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-mono text-muted">{children}</p>;
}
