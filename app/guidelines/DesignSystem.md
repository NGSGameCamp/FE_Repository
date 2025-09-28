# NGS Game Platform — Design System Guidelines

This guide codifies the visual language and component patterns in this repo so other models and contributors can deliver consistent UI.

## Principles

- Consistency: reuse tokens, utilities, and components instead of ad‑hoc styles.
- Readability: high contrast in dark mode; spacious but efficient layouts.
- Modularity: compose UIs from small primitives (Button, Card, Badge) and higher‑level sections (Featured, New Games, Categories, GameSection).
- Responsiveness: single‑column on mobile; multi‑column on large screens.

## Foundations

- Font: Inter via Google Fonts; base size `16px`.
- Theme: CSS variables in `app/global.css` with a `.dark` theme override.
- Colors (tokens):
  - Primary: `--primary` (dark: `#2563eb`)
  - Foreground/Background: `--foreground`, `--background`
  - Accent/Muted/Border: `--accent`, `--muted`, `--border`
  - Card/Popover: `--card`, `--popover`
  - Chart palette: `--chart-1..5`
- Radii: `--radius` mapped to Tailwind-style sizes (`--radius-{sm,md,lg,xl}`) in `@theme inline`.
- Utilities: precompiled Tailwind CSS lives in `app/index.css`. Not all utilities are present; prefer those already included.
- Custom helpers: `app/custom.css` defines layout helpers like `grid-7-3` (desktop 7fr/3fr) for the hero row.

## Layout

- Page container: `max-w-7xl mx-auto px-4 py-6` for main content.
- Section spacing: use `space-y-8` between major sections.
- Hero row (Featured + New Games):
  - Container: `grid grid-7-3 gap-6 items-stretch`.
  - Featured: left column; New Games: right column; both `h-full`.
  - At mobile (< 1024px) stack vertically (helper falls back to `1fr`).
- Cards grid (category views): `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6` (present in precompiled CSS).
- Horizontal lists: use `overflow-x-auto` and `scroll-snap` for carousels.

## Typography

- Headings: gradient accent for key titles.
  - Example: `bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent`.
- Base text: rely on tokenized colors (`text-foreground`, `text-muted-foreground`).

## Color & Effects

- Dark mode default; light mode supported by tokens.
- Interactive states:
  - Hover: subtle background (`/5–/10`) or border emphasis.
  - Focus: `focus-visible` ring via shared utilities.
- Decorative effects: soft gradients, neon glow utility `.neon-glow` for rare highlights; use sparingly.

## Components (Primitives)

- `Button` (`app/components/ui/button.tsx`)
  - Variants: `default | destructive | outline | secondary | ghost | link` via `cva`.
  - Sizes: `sm | default | lg | icon`.
  - Implementation: uses `React.forwardRef` and Radix `Slot` for `asChild` support.
  - Integration: When used inside Radix triggers (e.g., `DropdownMenuTrigger`), pass `asChild` to the trigger and render `<Button>` as child.

- `Card` (`app/components/ui/card.tsx`)
  - Purpose: neutral surface with border; used for list items, panels.
  - Compose with `CardHeader`, `CardContent`, etc., or plain `Card` wrapper.

- `Badge` (`app/components/ui/badge.tsx`)
  - Variants: `default | secondary | destructive | outline`.
  - Use for tags, statuses, small highlights.

## Page Modules

- Header (`app/components/Header.tsx`)
  - Sticky top bar with logo, search, actions.
  - Category shortcuts: “추천/트렌딩/신작” buttons + “장르별” Radix dropdown.
  - Guidelines: keep action buttons ghost/outline; avoid heavy fills in the header.

- FeaturedGame (`app/components/FeaturedGame.tsx`)
  - Content: genre badges, title, description, stats (rating/reviews/price), tags, actions.
  - Media: background image with low opacity overlay and gradient mask; foreground image tile on the right (hover scale).
  - Actions: primary “상세 페이지”, outline “팔로잉”.
  - Props: `embed` to fill parent height and remove outside margins when used in hero row.

- NewGamesSection (`app/components/NewGamesSection.tsx`)
  - Panel with title row and a list of up to 5 items (thumbnail, title, optional description, price).
  - Props: `embed` for hero row alignment.
  - Link: “더 보기” at header right.

- CategoriesSection (`app/components/CategoriesSection.tsx`)
  - Horizontal chip bar inside a `Card`; horizontally scrollable on small screens.
  - Buttons: rounded-full, outline on hover; `onSelect` passes the selected id upward.

- GameSection (`app/components/GameSection.tsx`)
  - Title row with optional “모두 보기”; left/right scroll buttons.
  - Body: horizontal scroll list with `scroll-snap` aligned cards.

- GameCard (`app/components/GameCard.tsx`)
  - Composition: media, title, tags (badges), rating/reviews/price; action icons as needed.

## Responsive & Breakpoints

- Mobile first; enhance at `min-width: 640px (sm)`, `1024px (lg)`, `1280px (xl)`, `1536px (2xl)`.
- Only use utilities present in `app/index.css`; if a needed utility is missing, add a small helper in `app/custom.css` (preferred) or extend the CSS build.

## Interaction & Motion

- Transitions: 150–300ms; use Tailwind transitions and hover/focus utilities.
- Hover scale for media preview (e.g., `hover:scale-105` on images) and soft glows.
- Carousels: “scroll” behavior with button nudges of ~320px.

## Accessibility

- Focus states: rely on shared `focus-visible` ring; don’t remove outlines.
- Semantic HTML: use buttons/links correctly; supply `alt` text for images.
- Contrast: ensure tokens provide sufficient contrast in dark and light themes.

## Coding Conventions

- Variants: define with `cva`; keep variant names concise and reusable across the repo.
- Forward refs for interactive primitives; required for Radix triggers.
- Use `asChild` and `Slot` to avoid nested button/anchor semantics.
- Keep styles in tokens/utilities; avoid inline styles except for necessary CSS props (e.g., scrollSnap) with clear intent.

## Patterns & Recipes

- Hero 7:3 Row
  - Container: `grid grid-7-3 gap-6 items-stretch`.
  - Children: both `h-full`; pass `embed` to `FeaturedGame` and `NewGamesSection`.

- Category View Grid
  - Container: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6`.
  - Title: gradient heading + muted count line.

- Horizontal Categories Bar
  - Use `CategoriesSection` with `onSelect`; keeps filter logic in parent.

## Don’ts

- Don’t introduce new ad‑hoc colors; use tokens.
- Don’t rely on utilities not present in `app/index.css` without adding a helper.
- Don’t bypass `forwardRef` on primitives used with Radix triggers.

## File Map

- Tokens & base: `app/global.css`
- Precompiled utilities: `app/index.css`
- Custom helpers: `app/custom.css`
- UI primitives: `app/components/ui/*`
- Page modules: `app/components/*Section.tsx`, `FeaturedGame.tsx`, `Header.tsx`

---

If you add a new component or pattern, document its purpose, props, variants, and example usage here to keep generation consistent across models.
