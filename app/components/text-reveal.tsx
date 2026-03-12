'use client'

import { useEffect, useRef } from 'react'

type Tag = 'h1' | 'h2' | 'p'

export function TextReveal({
  children,
  as,
  className,
  delay = 0,
}: {
  children: string
  as?: Tag
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = delay ? `${delay}ms` : ''
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  // Split into lines by wrapping each word (browser handles line-breaking)
  // We use a simple approach: one reveal-line per sentence/phrase chunk
  const Tag = as ?? 'p'

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={className}>
      {children.split(' ').map((word, i, arr) => (
        <span key={i} className="reveal-line" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span className="reveal-inner" style={{ display: 'inline-block' }}>
            {word}{i < arr.length - 1 ? '\u00a0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
