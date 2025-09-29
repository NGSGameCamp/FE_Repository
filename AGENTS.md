# Repository Guidelines

## Project Structure & Module Organization
- SPA entrypoint flows from `index.html` to `app/main.tsx` and finally into `app/App.tsx`.
- Feature views live inside `app/components/{community|game|order|support|user|layout}`; keep domain hooks, state, and tests co-located with their owning view.
- Shared primitives stay under `app/components/ui`; prefer extending existing variants before authoring new atoms.
- Static assets reside in `public/`, onboarding flows in `app/welcome/`, global tokens in `app/global.css`, Tailwind output in `app/index.css`, and local overrides in `app/custom.css`.

## Build, Test, and Development Commands
- `npm run dev` – start the Vite dev server on http://localhost:3000 for interactive work.
- `npm run build` – emit the optimized production bundle to `build/`; run before tagging releases.
- `npx vite preview` – serve the built bundle locally for QA or stakeholder demos.
- `vitest run` – execute the headless unit/component suites once Vitest dependencies are installed.

## Coding Style & Naming Conventions
- Author React 18 + TypeScript components in PascalCase; keep props, hooks, and state in camelCase.
- Use kebab-case utility classes sourced from tokens in `app/global.css`; extend `app/custom.css` only when a token is missing.
- Lean on `class-variance-authority` for variant logic and forward refs on interactive primitives, mirroring established UI patterns.
- Keep files ASCII-only and rely on repository formatter defaults; avoid introducing bespoke lint configurations.

## Testing Guidelines
- Co-locate `*.test.tsx` files with their component (e.g., `FeaturePanel.test.tsx`).
- Mock outbound requests through helpers in `app/api/*` to keep suites deterministic.
- Block merges on red suites; run `vitest run` or focused `vitest` commands before submitting a PR.

## Commit & Pull Request Guidelines
- Follow the `type(scope): summary` convention (example: `feat(header): add genre dropdown`) and keep commits small, reversible, and domain-focused.
- PRs should state intent, link tracking issues, attach before/after screenshots for UI updates, and call out accessibility or behavioral shifts.
- Confirm `npm run build` succeeds and document any manual QA steps in the PR description.

## Security & Configuration Tips
- Do not commit secrets or environment files; coordinate configuration changes with reviewers.
- Discuss any change to the default port 3000 defined in `vite.config.ts` before merging.
- Deploy by serving the contents of the `build/` directory to mirror production.

## Agent-Specific Instructions
- Ship incremental, review-friendly changes and reuse existing primitives/tokens before introducing new dependencies or patterns.
