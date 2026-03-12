'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function AnimateIn({
  children,
  className,
  delay = 0,
  variant = 'fade-up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'fade-up' | 'slide-left' | 'scale-up'
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
    <div
      ref={ref}
      data-animate={variant === 'fade-up' ? '' : undefined}
      data-animate-variant={variant !== 'fade-up' ? variant : undefined}
      className={className}
    >
      {children}
    </div>
  )
}
