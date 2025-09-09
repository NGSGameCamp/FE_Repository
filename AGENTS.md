#+ Repository Guidelines

## Project Structure & Module Organization
- Entry: `index.html` → `app/main.tsx` → `app/App.tsx`.
- UI: `app/components/*` (page modules) and `app/components/ui/*` (primitives: Button, Card, Badge, etc.).
- Styles: `app/global.css` (tokens/base), `app/index.css` (precompiled Tailwind utilities), `app/custom.css` (project helpers like `grid-7-3`).
- Assets: `public/*`, `app/welcome/*`.
- Config: `vite.config.ts` (alias `@` → `./app`), `tsconfig.json`.

## Build, Test, and Development Commands
- Dev server: `npm run dev`
  - Vite on `http://localhost:3000` (auto-open enabled).
- Build: `npm run build`
  - Outputs to `build/` (single-page app).
- Preview (optional): `npx vite preview` or serve `build/` with any static server.

## Coding Style & Naming Conventions
- Language: TypeScript + React 18. Components in PascalCase (e.g., `FeaturedGame.tsx`).
- Props/state names: `camelCase`. CSS helpers/classes: `kebab-case`.
- Use UI primitives from `app/components/ui/*`; add variants via `cva`.
- Forward refs for interactive primitives (Radix triggers require it).
- Styling: prefer design tokens from `app/global.css`; use utilities present in `app/index.css`. For gaps, add small helpers in `app/custom.css` (e.g., layout ratios).

## Testing Guidelines
- No formal test suite is included. When adding critical logic:
  - Add lightweight component tests next to the file (e.g., `Component.test.tsx`) using your preferred stack (Vitest + RTL recommended).
  - Keep tests deterministic; avoid network calls.

## Commit & Pull Request Guidelines
- Commits: small, descriptive messages (scope + intent). Example: `feat(header): add genre dropdown`.
- PRs: include summary, linked issues, before/after screenshots for UI, and notes on accessibility/behavioral changes.
- Ensure `npm run build` passes and no type errors.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables and document expected keys.
- Vite dev server runs on port `3000`; update `vite.config.ts` if you must change it.
- Dockerfile may require a `start` script or static serving; align with SPA build if containerizing.

## Agent-Specific Instructions
- Make minimal, focused changes; respect existing tokens, variants, and patterns.
- Avoid introducing new dependencies without discussion; leverage existing primitives and helpers.
