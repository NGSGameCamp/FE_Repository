# Repository Guidelines

## Project Structure & Module Organization
The SPA mounts from `index.html` through `app/main.tsx` into `app/App.tsx`. Feature views live in `app/components/{community|game|order|support|user|layout}`—keep domain logic, hooks, and nearby tests co-located. Shared primitives stay in `app/components/ui/*`; extend existing variants before creating new atoms. Static assets sit in `public/`, onboarding media in `app/welcome/`, and styling tokens in `app/global.css` with Tailwind outputs in `app/index.css` and local helpers in `app/custom.css`.

## Build, Test, and Development Commands
- `npm run dev` – launch the Vite dev server on http://localhost:3000.
- `npm run build` – emit an optimized bundle into `build/`.
- `npx vite preview` – serve the production bundle for QA checks.
- `vitest run` – execute headless component and unit suites when installed.

## Coding Style & Naming Conventions
Author React 18 + TypeScript components in PascalCase, props/state in camelCase, and CSS helpers in kebab-case. Source colors, spacing, and typography from `app/global.css` before extending `app/custom.css`. Favor `class-variance-authority` for variant logic and forward refs on interactive primitives. Stick to ASCII and rely on repository formatting defaults.

## Testing Guidelines
Place Vitest + React Testing Library specs next to the component they cover (e.g., `FeaturePanel.test.tsx`). Mock outbound calls and asynchronous boundaries to keep results deterministic. Use `vitest run` for regression sweeps and block merges until critical flows are covered.

## API Request Guidelines
Use `app/api/fetchApi.ts` as the single entrypoint for network calls. It prepends `API_BASE_URL` (`/api`), enforces `credentials: "include"`, and normalizes JSON headers and error messaging—reuse it instead of raw `fetch`. Feature modules expose typed helpers such as `app/api/order/orderApi.ts`, `app/api/sign/signApi.ts`, `app/api/game/gameApi.ts`, `app/api/community/communityApi.ts`, and `app/api/publisher/publisherApi.ts`; extend these or mirror their patterns when adding endpoints. Model payloads in adjacent `types.ts` files and encode bodies with `JSON.stringify` before passing to `fetchApi`.

## Commit & Pull Request Guidelines
Follow `type(scope): summary` (e.g., `feat(header): add genre dropdown`). Keep commits focused and reversible. PRs must state intent, link issues, include before/after screenshots for UI shifts, and call out accessibility or behavioral updates. Run `npm run build` and relevant tests before requesting review.

## Security & Configuration Tips
Do not check in secrets. Coordinate any change to the default port 3000 declared in `vite.config.ts`. Deploy by serving the `build/` directory to mirror production.

## Agent-Specific Instructions
Ship incremental, easy-to-review changes. Reuse established primitives and tokens before introducing new dependencies or patterns.
