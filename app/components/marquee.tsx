export function Marquee({ items }: { items: string[] }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-3 border-y border-white/[0.08]" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="label-mono text-muted whitespace-nowrap px-6">
            {item}
            <span className="ml-6 text-muted/40">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
