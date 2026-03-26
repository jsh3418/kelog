@AGENTS.md

# Kelog - Korean Developer Blog

## Project
- Next.js 16.2.0 blog with MDX content
- Tailwind CSS v4 for styling
- TypeScript throughout

## Structure
- `app/` — Next.js App Router pages and components
- `content/posts/` — MDX blog post source files
- `lib/` — Utility functions (MDX processing, etc.)
- `types/` — TypeScript type definitions
- `public/` — Static assets
- `scripts/` — Automation scripts (Slack bot, etc.)

## Commands
- `npm run dev` — Development server
- `npm run build` — Production build (use to verify changes)
- `npm run lint` — ESLint check
- `npm test` — Run vitest tests

## Conventions
- Blog posts go in `content/posts/<slug>.mdx`
- Korean language for blog content, English for code/comments
- Use Tailwind CSS classes, dark mode via next-themes
