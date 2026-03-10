'use client'

import { useEffect, useRef, useState } from 'react'

function parseValue(val: string) {
  const match = val.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: val, decimals: 0 }
  const [, prefix, numStr, suffix] = match
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return { prefix, number: parseFloat(numStr), suffix, decimals }
}

export function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState<string>('')
  const ref = useRef<HTMLSpanElement>(null)
  const { prefix, number, suffix, decimals } = parseValue(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.unobserve(el)

        const duration = 1400
        const start = performance.now()
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1)
          const current = number * easeOut(progress)
          setDisplay(prefix + current.toFixed(decimals) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, number, prefix, suffix, decimals])

  return <span ref={ref}>{display || value}</span>
}
