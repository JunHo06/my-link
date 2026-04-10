# GEMINI.md - Project Context

This file provides context and instructions for AI agents working on the `my-profile` project.

## Project Overview

`my-profile` is a modern web application built with **Next.js 16.2.3** and **React 19**. It leverages **Tailwind CSS 4** for styling and **TypeScript** for a type-safe development experience.

### Main Technologies
- **Framework:** Next.js 16.2.3 (using the App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4 (with CSS-first configuration)
- **Language:** TypeScript
- **Fonts:** Geist (Sans and Mono) via `next/font`

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm, yarn, pnpm, or bun

### Commands
All commands should be run within the `my-profile` directory:

- `npm run dev`: Start the development server at `http://localhost:3000`.
- `npm run build`: Create an optimized production build.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint for code quality and style checks.

## Architecture and Structure

The project follows the standard Next.js App Router architecture:

- `my-profile/app/`: The core application code.
  - `layout.tsx`: Root layout defining fonts and global metadata.
  - `page.tsx`: The main landing page.
  - `globals.css`: Global styles and Tailwind CSS 4 theme configuration.
- `my-profile/public/`: Static assets (images, icons, etc.).
- `my-profile/next.config.ts`: Next.js-specific configuration.
- `my-profile/tsconfig.json`: TypeScript configuration.

## Development Conventions

- **Server Components:** Prefer React Server Components for data fetching and static content.
- **Styling:** Use Tailwind CSS utility classes. Custom theme variables are defined in `app/globals.css` using the `@theme` directive (Tailwind CSS 4).
- **Type Safety:** Ensure all new components and functions are properly typed using TypeScript.
- **Linting:** Adhere to the established ESLint rules to maintain code consistency.
- **Fonts:** Use the `--font-geist-sans` and `--font-geist-mono` variables for consistent typography.

## Key Files
- `my-profile/package.json`: Project dependencies and scripts.
- `my-profile/app/layout.tsx`: Root layout and font setup.
- `my-profile/app/globals.css`: Tailwind 4 and global styles.
