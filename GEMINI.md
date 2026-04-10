# GEMINI.md - MyLink Project Guide

This file provides essential instructions and context for AI agents working on the **MyLink** project. All actions must strictly adhere to these guidelines.

## 1. Project Overview
**MyLink** is a link aggregation service (Linktree clone) that allows users to manage and share multiple links through a single page.

### Core Tech Stack
- **Framework:** Next.js 16.1.7 (App Router)
- **Library:** React 19.2.4
- **Styling:** Tailwind CSS 4.2.1 (CSS-first configuration)
- **Language:** TypeScript 5.9.3
- **UI Components:** Shadcn UI, Radix UI, Lucide Icons
- **Fonts:** Geist (Sans, Mono) via `next/font`

## 2. Project Architecture
- `@app/`: App Router pages and layouts.
- `@components/`: UI and business components.
  - `@ui/`: Base components from Shadcn UI.
- `@docs/`: PRD, User Scenarios, and Wireframe documentation.
- `@hooks/`: Custom React hooks.
- `@lib/`: Utilities and configurations (e.g., `@lib/utils.ts`).
- `@public/`: Static assets (images, icons).
- `@my-profile/`: Sub-module or reference Next.js setup.

## 3. Key Commands
- `npm run dev`: Start dev server with Turbopack (`http://localhost:3000`).
- `npm run build`: Create production build.
- `npm run start`: Run production build.
- `npm run lint`: Run ESLint checks.
- `npm run format`: Format code with Prettier.
- `npm run typecheck`: Run TypeScript compiler check.

## 4. Development Conventions

### Styling (Tailwind CSS 4)
- Follow Tailwind CSS 4 CSS-first setup.
- Define global styles and theme variables in `@app/globals.css` using the `@theme` directive.
- Use the `cn()` utility from `@lib/utils.ts` for dynamic class merging.

### Component Development
- **Server Components:** Use React Server Components by default for fetching and static content.
- **Client Components:** Use `'use client'` only when interactivity is required.
- **Type Safety:** Maintain strict TypeScript definitions for all props and functions.
- **Accessibility:** Follow Radix UI and Shadcn UI accessibility standards.

### Typography
- Use Geist Sans and Geist Mono. Apply via `--font-geist-sans` and `--font-geist-mono` CSS variables.

## 5. Reference Documentation
- See `@docs/PRD.md` for detailed requirements.
- See `@docs/user_scenario.md` for user flows.
- See `@docs/wireframe.md` for UI designs.

---
**Note:** Changes to `@GEMINI.md` must be discussed with the user as it serves as the foundational guide for the project.
