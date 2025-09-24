# Repository Guidelines

## Project Structure & Module Organization
App bootstraps from `index.html` to `app/main.tsx` and renders `app/App.tsx`. Feature pages live under `app/components/*` while reusable primitives live in `app/components/ui/*` (e.g., `Button`, `Card`). Global styles are split between `app/global.css` for tokens, `app/index.css` for generated Tailwind utilities, and `app/custom.css` for local helpers such as `grid-7-3`. Place static assets in `public/` and onboarding assets in `app/welcome/`. Resolve aliases with the `@` prefix configured in `vite.config.ts`; TypeScript settings reside in `tsconfig.json`.

## Build, Test, and Development Commands
Run `npm run dev` to start the Vite dev server on `http://localhost:3000` (auto-open enabled). Use `npm run build` for production bundles emitted to `build/`. Preview a build locally via `npx vite preview` or serve the `build/` folder with any static server.

## Coding Style & Naming Conventions
Write React 18 + TypeScript using `camelCase` for variables/props and PascalCase for components (`FeaturedGame.tsx`). Keep CSS helpers in `kebab-case`. Compose UI with primitives from `app/components/ui/*`; add variants through `cva` when needed and prefer forwarding refs for interactive elements. Pull colors, spacing, and typography from `app/global.css`, supplementing with utilities defined in `app/index.css` before adding small helpers to `app/custom.css`.

## Testing Guidelines
While no suite ships with the repo, add deterministic Vitest + React Testing Library component tests alongside features (e.g., `FeaturePanel.test.tsx`). Avoid hitting the network; mock external data or use static fixtures. Run tests with `npm test` if defined, or execute `vitest run` after installing the tooling.

## Commit & Pull Request Guidelines
Write focused commits using the `type(scope): summary` convention, such as `feat(header): add genre dropdown`. Each PR should include a concise summary, linked issues, before/after UI screenshots, and notes on accessibility or behavioral changes. Always ensure `npm run build` and type checks succeed before requesting review.

## Security & Configuration Tips
Keep secrets out of version control and document required environment variables. The dev server defaults to port 3000; update `vite.config.ts` only if coordination across the team is confirmed. When containerizing, mirror the SPA production build emitted to `build/`.

## Agent-Specific Instructions
Favor incremental, minimal changes. Reuse existing primitives and tokens before creating new ones, and avoid introducing dependencies unless the team agrees.
