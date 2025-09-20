# Marksy AI Assistant Instructions

Purpose: Academic marks tracker (A/L) built with Vite + React + TypeScript + Tailwind + shadcn-ui (Radix primitives). Data persistence is entirely client-side via localStorage (no backend). Focus on UX polish (glass / gradient dark-academic theme) and productivity features (marks entry, subject analysis, achievements, export/import).

## Architecture & Data Flow
- Entry: `src/pages/Index.tsx` manages active section navigation (Add Marks, Subject Analysis, etc.).
- UI Composition: Reusable primitive components live under `src/components/ui/` (generated via shadcn). Higher-level feature components: `AddMarks.tsx`, `SubjectAnalysis.tsx`, `ProfilePage.tsx`, etc.
- State Persistence: Marks & todos stored in localStorage keys:
  - `alMarksData`: Array of marks objects `{ id, subject, paperType?, mcq?, seq?, essay?, date, paperName, tutor, total }`.
  - `alTodos`: Array of todo objects.
  - `favoriteSubjects`: Array of subject ids (strings).
- Derived Analytics: `SubjectAnalysis.tsx` recalculates grade distribution, subject stats, achievements on render (functions inside component; NOT centralized yet).
- Theming: `ThemeContext.tsx` + Tailwind CSS variables in `index-new.css`; `.text-gradient` for headings; custom component classes (`academic-card`, `academic-button-*`, `subject-card`).

## Conventions & Patterns
- All color, gradient, shadow, animation tokens defined as CSS custom props inside `index-new.css` root; prefer adding new variants there and referencing via Tailwind's `hsl(var(--token))` pattern.
- Achievements logic currently duplicated potential risk; if reusing externally, extract pure functions (keep signature `(marksData: MarksData[]) => Achievement[]`).
- Mark totals: computed as simple sum of mcq + seq + essay (all assumed 0–100). Some analytics (grade letter) assume a 300 max (hard-coded). If introducing variable paper structures, centralize constants.
- Subjects: Hard-coded arrays in `AddMarks.tsx` (for selection) and inside `SubjectAnalysis.tsx` (for analysis). Any feature requiring dynamic subject addition must refactor to derive subject list from existing marks + favorites.
- Exports: Current export is JSON only; inline implementation creates a Blob and auto downloads. Imports validate minimal required fields.
- Animations: Utility classes `.animate-fade-in`, `.animate-slide-up`, `.animate-bounce-in` applied at component root or card level; keep transitions light for performance.

## Typical Workflows
- Dev server: `npm run dev` (Vite). Build: `npm run build`. Preview static build: `npm run preview`.
- Lint: `npm run lint` (ESLint with React hooks + refresh plugins, TS).
- No test suite currently; any new logic should be covered via small pure functions for easy future unit tests.
- When adding a Radical UI/shadcn primitive, match pattern in `ui/` folder (export a component plus `...` variant definitions) and style via Tailwind + tokens.

## Adding Features (Examples)
- New persistent data: Use `useState` initializer + `localStorage.getItem` parse; update both state & localStorage on mutation.
- New export format (e.g. XLSX): Gather `alMarksData`, achievements (derive via helper), favorites; structure sheets logically (Subjects, Marks, Achievements, Meta). Avoid blocking UI: optionally wrap heavy generation in `setTimeout`.
- Dynamic subjects: Derive with `Array.from(new Set(marksData.map(m => m.subject)))` then merge with favorites for ordering.

## Styling Guidelines
- Prefer extending existing gradient variables (`--gradient-*`). For “3D” effect: layered gradients + shadow tokens (`--shadow-card`, `--shadow-hover`).
- Avoid pure black (#000); use background tokens or create new `--background-alt` if higher contrast needed.
- Badge / achievement visuals: Use emoji + gradient background with subtle border + glow (`shadow-[...]` matching existing tokens).

## Pitfalls / Gotchas
- Multiple hard-coded subject sources (AddMarks vs SubjectAnalysis) can desync; refactor before adding more subjects or stream groupings.
- Grade calculations assume fixed max total (300). Changing scoring scheme requires adjusting `getGrade` + dependent achievement thresholds.
- Import does minimal validation; malformed numeric fields (strings) not coerced. Sanitize if adding analytics relying on numeric ops.
- Large localStorage writes (many mark entries) are synchronous; keep objects small and avoid frequent mass rewrites in loops.

## Extension Opportunities
- Extract achievements & grading helpers into `src/lib/analytics.ts` for reuse (export pure functions).
- Introduce subject metadata file `src/data/subjects.ts` with streams & paper structure mapping to stop scattering constants.
- Provide theming toggle variations via CSS data attributes.

Use these guidelines to stay consistent: prefer pure helper extraction for any logic reused across components, derive dynamic lists (subjects, achievements) from state-backed storage, and keep styling within the existing token/utility system.
