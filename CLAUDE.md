# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no tests in this project.

## Architecture

This is a **Next.js 16 personal portfolio site** using the App Router, React 19, TypeScript, and Tailwind CSS v4.

### Content data flow

All site content lives as JSON files in `content/`. These are typed via `types/content.ts` and re-exported through `lib/content.ts`. Pages import from `lib/content` — never directly from `content/` JSON files.

To update site content, edit the appropriate JSON file in `content/`:
- `hero.json` — name, bio, CTAs
- `about.json` — essay paragraphs, education, links
- `experience.json` — work history
- `case-studies.json` — featured work cards on the homepage
- `stack.json` — tech stack domains
- `impact.json` — impact stat strip
- `projects.json` — projects page
- `genai.json` — gen-ai page

If adding a new content type, add its TypeScript type to `types/content.ts`, add its JSON file to `content/`, then add a typed export to `lib/content.ts`.

### Page structure

`app/layout.tsx` renders a persistent sidebar (desktop) and top nav (mobile) with anchor links that all point to sections on the single-page `app/page.tsx`. The sidebar is fixed at `w-64` with `md:ml-64` offset on the main content area.

`app/page.tsx` is the main single-page portfolio. Additional pages (`about`, `experience`, `projects`, `gen-ai`) exist under `app/` but the primary UX is the single-page scrolling layout.

### Styling

Tailwind CSS v4 (configured via `postcss.config.mjs` with `@tailwindcss/postcss`). Global CSS is in `app/globals.css` using `@import "tailwindcss"` (v4 syntax, not `@tailwind` directives).

Custom CSS variables defined in `:root`:
- `--background`: `#f8f5f0` (warm off-white page background)
- `--accent`: `#2a6b7c` (teal used for highlights and metrics)

Custom utility classes in `globals.css`: `.bg-page`, `.text-page`, `.bg-sidebar`, `.text-accent`, `.border-accent`, `.noise-hero`, `.section-shell`.

Fonts: `DM_Serif_Display` (`--font-display`) and `Source_Sans_3` (`--font-sans`), loaded via `next/font/google`.

### Path aliases

`@/` maps to the project root (configured in `tsconfig.json`).
