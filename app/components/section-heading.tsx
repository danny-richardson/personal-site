import type { ReactNode } from 'react'

export function SectionHeading({
  number,
  children,
}: {
  number: string
  children: ReactNode
}) {
  return (
    <div className="relative">
      {/* Large background numeral */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none select-none absolute -top-4 -left-2 text-[7rem] leading-none opacity-[0.05] text-foreground"
      >
        {number}
      </span>
      <h2 className="font-display text-2xl md:text-3xl tracking-tight relative">
        {children}
      </h2>
      <span className="border-draw mt-1" />
    </div>
  )
}
