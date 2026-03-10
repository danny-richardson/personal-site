'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const sectionIds = ['home', 'work', 'stack', 'impact', 'about', 'education', 'experience', 'connect']

export function NavActive({
  links,
}: {
  links: readonly { href: string; label: string }[]
}) {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="space-y-1 text-sm">
      {links.map((link) => {
        const id = link.href.replace('/#', '')
        const isActive = active === id
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
              isActive
                ? 'bg-accent/8 font-medium text-accent'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
                isActive ? 'bg-accent' : 'bg-transparent'
              }`}
            />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
