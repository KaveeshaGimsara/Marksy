# Marksy

Smart, privacy‑friendly progress tracking for Sri Lankan G.C.E. A/L students. Record paper results, monitor subject performance, and stay motivated—fully offline in your browser (data lives only in your localStorage).

> No mock data. No tracking. Your real progress only.

## Features

Implemented today (only listing what actually exists):

- Add marks per paper (MCQ / Structured / Essay) with automatic total
- Subject list with starring (favorites) and persistent storage
- Delete individual marks entries
- Real‑time quick stats (total marks sum, papers done, average score, simple activity streak)
- Subject performance analysis (per‑subject averages, best / worst, improvement)
- Grade distribution (A / B / C / S / W / F) logic
- Study task (todo) list with per‑task completion
- Bilingual interface (English + Sinhala for key UI strings)
- Motivational rotating quotes (English & Sinhala sets)
- Responsive UI (mobile friendly)
- Dark mode support (CSS variables + Tailwind)
- Accessible focus styles & improved contrast for notice board + buttons
- Unified support link (BuyMeACoffee → geekyedu)
- MIT license (2025) with proper attribution
- Modern favicon (SVG gradient)

Intentionally omitted until real data is available: upcoming exam/event placeholders, artificial stats, fake timelines.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (layered design tokens)
- shadcn/ui component patterns
- lucide-react icons

## Local Development

Prerequisites: Node.js 18+ (recommended via nvm or fnm)

Clone & run:

```sh
git clone https://github.com/kaveeshagimsara/marksy.git
cd marksy
npm install
npm run dev
```

Then open the Vite dev URL (usually http://localhost:5173/).

### Environment Variables

Two environment files are included:

- `.env.development` sets `VITE_SITE_URL=http://localhost:5173`
- `.env.production` sets `VITE_SITE_URL=https://marksy-al.vercel.app`

Use `VITE_SITE_URL` anywhere in `index.html` as `%VITE_SITE_URL%` for absolute social meta tags (Telegram & LinkedIn require absolute URLs).

During `vite build` a small plugin replaces the placeholder `__OG_UPDATED_TIME__` with the current ISO timestamp so `og:updated_time` always reflects the deployment and helps cache bust social previews.

If you change the deployment domain, update `.env.production` only—no need to edit `index.html` again.

## Usage Overview

1. Go to Add Marks
2. Star or add your subjects (max 6 favorites at a time)
3. Enter paper name, date, and MCQ / SEQ / Essay marks
4. Save → entry is stored in localStorage (key: alMarksData)
5. Visit Dashboard / Home to see quick stats update
6. Use Subject Analysis for deeper per‑subject breakdown
7. Optionally manage study tasks in analysis view

Everything persists automatically in the same browser/profile.

## Data Storage (Local Only)

LocalStorage keys currently used:

| Key | Purpose |
| --- | ------- |
| alMarksData | Array of mark entries { subject, mcq, seq, essay, total, paperName, date, timestamp } |
| alSubjects | Array of subjects { name, isFavorite } |
| marksy-profile | Future profile data (if present) |
| marksy-student-name | Preferred student name for greeting |
| alTodos | Study task list items |

No network sync & no analytics collection.

## Accessibility & UX

- High contrast dark/light variants on key interactive surfaces
- Focus-visible outlines preserved
- Semantic icons with descriptive text neighbors
- Avoids auto-playing media or motion beyond subtle pulses

## Support

If this helps your studies, you can support development:

https://buymeacoffee.com/geekyedu

## Contributing

Lightweight for now. Feel free to open issues or small PRs (typos, accessibility, performance). Larger feature discussions welcome via issue first.

Coding style: TypeScript + functional React, minimal external state. Prefer small cohesive components and no mock payload additions.

## License

MIT © 2025 Kaveesha Gimsara. See LICENSE file for full text.

## Credits

- Design system pieces inspired by shadcn/ui
- Icons: lucide-react
- Community feedback from Sri Lankan A/L student circles

## Roadmap (Non‑speculative, pending validation)

- Optional hiding of empty “Upcoming Events” block
- Export / backup & import of local data (JSON)
- Basic charts for subject trends (real data only)
- Multi-profile support (if real need emerges)

---

Built with ❤️ for real students. If it’s not authentic, it won’t ship here.