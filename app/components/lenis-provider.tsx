'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: import('lenis').default | null = null
    let rafId: number

    async function init() {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true })

      function raf(time: number) {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      // Intercept anchor link clicks so Lenis handles the scroll
      function onAnchorClick(e: MouseEvent) {
        const anchor = (e.target as HTMLElement).closest('a')
        if (!anchor) return
        const href = anchor.getAttribute('href')
        if (!href) return

        // Match pure hash (#work) or same-page hash (/#work)
        const hashMatch = href.match(/^(?:\/)?#(.+)$/)
        if (!hashMatch) return

        const target = document.getElementById(hashMatch[1])
        if (!target) return

        e.preventDefault()
        lenis?.scrollTo(target, { offset: -64 }) // account for fixed nav height
      }

      document.addEventListener('click', onAnchorClick)

      // Store cleanup ref
      ;(lenis as unknown as { _anchorCleanup: () => void })._anchorCleanup = () => {
        document.removeEventListener('click', onAnchorClick)
      }
    }

    init()

    return () => {
      cancelAnimationFrame(rafId)
      ;(lenis as unknown as { _anchorCleanup?: () => void })?._anchorCleanup?.()
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}
