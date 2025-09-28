# Repository Guidelines

## Project Structure & Module Organization
The app boots from `index.html`, mounts through `app/main.tsx`, and renders the root component in `app/App.tsx`. Feature pages live under `app/components/*`, grouped by domain (`community`, `game`, `order`, `support`, `user`, `layout`), while shared primitives (e.g., `Button`, `Card`) reside in `app/components/ui/*`; prefer extending these before adding new widgets. Static assets belong in `public/`, with onboarding-specific media in `app/welcome/`. Global design tokens live in `app/global.css`, generated Tailwind utilities in `app/index.css`, and local helpers such as `grid-7-3` in `app/custom.css`. Resolve aliases using the `@` prefix configured in `vite.config.ts`; TypeScript options are centralized in `tsconfig.json`.

## Build, Test, and Development Commands
Run `npm run dev` to start the Vite dev server on `http://localhost:3000` (auto-open enabled). Create production bundles with `npm run build`, which emits artifacts to `build/`. Preview a built bundle via `npx vite preview` or serve the `build/` directory using any static server. If Vitest is installed, execute `vitest run` for headless tests.

## Coding Style & Naming Conventions
Write React 18 + TypeScript components using PascalCase and camelCase props/state. Keep CSS helpers in kebab-case and pull colors, spacing, and typography from `app/global.css` before adding utilities to `app/custom.css`. Compose UI using primitives from `app/components/ui/*`, adding variants through `cva` and forwarding refs for interactive elements. Stick to ASCII and rely on existing linting/formatting defaults.

## Testing Guidelines
Favor deterministic component tests with Vitest and React Testing Library alongside feature files (e.g., `FeaturePanel.test.tsx`). Mock network calls or use fixtures; avoid live requests. Ensure new behavior ships with targeted coverage and can run via `vitest run`.

## Commit & Pull Request Guidelines
Follow the `type(scope): summary` convention, such as `feat(header): add genre dropdown`. PRs should summarize the change, link relevant issues, include before/after screenshots for UI updates, and call out accessibility or behavioral shifts. Verify `npm run build` and type checks before requesting review.

## Security & Configuration Tips
Do not commit secrets. The dev server defaults to port `3000`; coordinate before changing `vite.config.ts`. Mirror the SPA production build from `build/` when containerizing or deploying.

## Agent-Specific Instructions
Favor incremental, minimal changes. Reuse existing primitives and tokens before introducing new dependencies or patterns.
