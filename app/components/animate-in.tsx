'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function AnimateIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = delay ? `${delay}ms` : ''
          el.classList.add('in-view')
          observer.unobserve(el)
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} data-animate className={className}>
      {children}
    </div>
  )
}
