```
██████╗ ███████╗██╗   ██╗ ██████╗ ███████╗
██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔════╝
██║  ██║█████╗  ██║   ██║██║   ██║███████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║╚════██║
██████╔╝███████╗ ╚████╔╝ ╚██████╔╝███████║
╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚══════╝
```

**Your personal developer command center — Track projects, monitor integrations, and stay in flow.**

[![React 19](https://img.shields.io/badge/React-19-4f8ef7?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-local-2a7a3b?style=flat-square&logo=sqlite)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)

DevOS is a local-first personal dashboard for developers. No backend, no accounts, no tracking — everything lives on your machine. Connect your tools, track your projects, and monitor what you're learning, all in one place.

---

## 🚀 Features

- **9 Integrations** — GitHub, OpenRouter, WakaTime, Vercel, Railway, Render, Supabase, DEV.to, Ollama — each with inline configure, verify on save, and disconnect
- **Dashboard** — QuickStats, Today at a Glance strip, horizontal scrollable widget row with snap, skeleton placeholders, collapsible widgets, Quick Note card
- **Focus Mode** — Hides all widgets and Quick Note, shows only Currently Learning + Recent Projects sections
- **Widget customizer** — Toggle visibility per integration from the dashboard header
- **Collapsible widgets** — Minimize any widget with a chevron toggle, persisted to localStorage
- **Project management** — Track status, priority, GitHub/live URLs, notes
- **Learning tracker** — Topics, progress bars, sources, roadmap
- **Quick Notes** — Instant auto-saved scratchpad on your dashboard
- **Dark / Light theme** — Warm, easy-on-the-eyes palette. Light mode uses muted, eye-friendly colors (never pure white)
- **Framer Motion animations** — Subtle page transitions and AnimatePresence on collapsible widget bodies
- **Fully responsive** — Bottom nav on mobile, adaptive grid throughout
- **Import / Export JSON** — Full data backup with all settings and integration configs
- **Landing page** — Full-page entry with hero, animated features grid, integrations strip, and footer
- **Motivational quotes** — Daily quote popup (bottom-left) with mix of English/Arabic, auto-dismisses after 6s
- **Keyboard shortcuts** — `N` new project, `/` search, `G` then `D/P/L/S` navigate pages
- **Semantic color system** — Consistent button styles (`.btn-edit`, `.btn-delete`, `.btn-confirm`) across all actions
- **Loading bar** — Subtle top progress bar during integration data fetch
- **Widget aria-labels** — All interactive elements accessible via screen readers
- **Mobile optimizations** — 20 background particles (down from 60), bottom-sheet modals, 44px tap targets
- **Health check script** — `npm run health` runs 8 checks: types, deps, dead imports, env vars, build size, circular deps, console.logs, unused imports
- **Docker support** — One-command deploy via Docker Compose with Nginx

---

## 📦 Tech Stack

| Tool             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| React 19         | UI framework                             |
| TypeScript 6     | Type safety                              |
| Vite 8           | Build tool and dev server                |
| React Router v6  | Client-side routing                      |
| Zustand          | State management                         |
| idb              | IndexedDB wrapper for persistent storage |
| Framer Motion 12 | Declarative animations                   |
| Lucide React     | Icons                                    |
| React Hook Form  | Form state management                    |
| Zod              | Schema validation                        |
| Plain CSS        | Styling (no Tailwind, no UI libraries)   |
| Docker / Nginx   | Production deployment                    |

---

## 📁 Project Structure

```
DevOS/
├── client/
│   ├── public/
│   │   └── favicon.svg            # Clean monogram SVG ("D" + "O")
│   ├── scripts/
│   │   └── health-check.ts       # 8-check health audit (run: npm run health)
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/             # ProjectCard, StatCard, IntegrationCard
│   │   │   ├── layout/           # Sidebar, Topbar, BottomNav
│   │   │   ├── ui/              # Badge, Modal, Toast, EmptyState, SearchBar, AppLogo, MotivationalPop
│   │   │   └── widgets/         # GitHub, WakaTime, Vercel, Railway, Render, Supabase, DEV.to, Ollama, OpenRouter
│   │   ├── constants/
│   │   │   └── index.ts          # Routes, status maps, defaults
│   │   ├── db/
│   │   │   └── index.ts          # All IndexedDB operations via idb
│   │   ├── features/
│   │   │   ├── dashboard/        # QuickStats
│   │   │   ├── learning/         # LearningForm
│   │   │   └── projects/         # ProjectForm, ProjectsFilter
│   │   ├── hooks/                # useToast, useModal, useWidgetCollapse, useWidgetVisibility, useIntegrationData, useKeyboardShortcuts
│   │   ├── pages/                # Landing, Dashboard, Projects, ProjectDetail, Learning, Settings
│   │   ├── services/             # GitHub, OpenRouter, WakaTime, Vercel, Railway, Render, Supabase, DEV.to, Ollama, auth
│   │   ├── store/                # Zustand stores (projects, learning, settings)
│   │   ├── styles/
│   │   │   └── global.css        # All CSS variables, skeletons, scroll rows, responsive breakpoints
│   │   ├── types/
│   │   │   └── index.ts          # All TypeScript interfaces
│   │   ├── utils/                # Helpers
│   │   ├── App.tsx               # Root layout with theme provider and router
│   │   └── main.tsx              # Entry point
│   ├── index.html                # SEO-optimized: OG tags, Twitter Card, JSON-LD, preconnect fonts, favicon link
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts            # Production chunk splitting via function, es2020 target
├── docker-compose.yml
├── Dockerfile                    # Multi-stage: Node build → Nginx serve
├── nginx.conf                    # Gzip, cache, SPA fallback, security headers
└── README.md
```

---

## 🛠 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional, for containerized deployment)

### Installation

```bash
cd client
npm install
```

### Run Dev

```bash
cd client
npm run dev
```

Opens at `http://localhost:5173`.

### Build

```bash
cd client
npm run build
```

Output goes to `client/dist/`.

### Docker

```bash
docker compose up --build
```

Opens at `http://localhost:3000` behind an Nginx reverse proxy.

---

## 📖 Usage

### Landing (`/`)

Entry page with hero section, animated features grid, integrations strip, and footer. Choose **Continue as Guest** to enter the dashboard. Sign In button is a placeholder for future auth.

### Dashboard (`/dashboard`)

Your command center. The header shows the current date, a Focus Mode toggle, and a Customize dropdown to toggle widget visibility. A daily motivational quote pops up 2s after load (bottom-left). QuickStats display key metrics. The "Today at a Glance" strip gives a live summary of your connected integrations. Below, a horizontal scrollable row shows each connected widget with skeleton placeholders during loading. Each widget can be collapsed via its chevron toggle. At the bottom, the Quick Note card provides an auto-saved scratchpad.

**Focus Mode** hides the widget row and Quick Note, showing only your Currently Learning topics and Recent Projects — keeping you on track.

### Projects (`/projects`)

Manage your projects with full CRUD. Track status (Planning, Active, Paused, Completed, Archived), priority (Low, Medium, High, Critical), GitHub repository URL, live URL, and notes. Filter by status and search by name.

### Learning (`/learning`)

Track what you're learning. Each topic has a title, progress bar (0–100%), source (Course, Book, Article, Video, Documentation, Other), and optional roadmap. Mark topics as complete and watch your progress grow.

### Settings (`/settings`)

Three tabs:

- **General** — Theme toggle (Dark/Light) and import/export all data as JSON
- **Integrations** — Connect up to 9 services. Each card has an inline form for your API key/username/token, a "Verify & Save" button that tests the connection, and a Disconnect button. Configuration is previewed on re-entry (masked key)
- **Data** — Clear all data or import a backup JSON

---

## 🔌 Integrations

All API keys are stored **locally in IndexedDB only**. Never sent to any server other than the respective service's official API.

| Service    | Where to get your key                                                               |
| ---------- | ----------------------------------------------------------------------------------- |
| GitHub     | No key needed — just your username                                                  |
| OpenRouter | [openrouter.ai/keys](https://openrouter.ai/keys)                                    |
| WakaTime   | [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key)              |
| Vercel     | [vercel.com/account/tokens](https://vercel.com/account/tokens)                      |
| Railway    | [railway.app/account/tokens](https://railway.app/account/tokens)                    |
| Render     | [dashboard.render.com/u/settings#api-keys](https://dashboard.render.com/u/settings) |
| Supabase   | [app.supabase.com/account/tokens](https://app.supabase.com/account/tokens)          |
| DEV.to     | [dev.to/settings/extensions](https://dev.to/settings/extensions)                    |
| Ollama     | Run locally at `http://localhost:11434`                                             |

---

## 💾 Data & Privacy

- Zero backend. Zero telemetry. Zero accounts.
- All data stored in your browser's IndexedDB.
- API keys never leave your device (requests go directly to each service).
- Export your data anytime as JSON from **Settings → Data**.

---

## 🐳 Docker

```bash
docker compose up --build
```

The app is served on port 3000 via Nginx. The Dockerfile uses a multi-stage build: Node for the Vite build, then Nginx alpine to serve the static assets with gzip, caching, and security headers.

---

## ⌨️ Keyboard Shortcuts

Available on any page (not while typing in inputs):

| Shortcut | Action |
|----------|--------|
| `N` | New project |
| `/` | Focus search bar |
| `G` then `D` | Go to Dashboard |
| `G` then `P` | Go to Projects |
| `G` then `L` | Go to Learning |
| `G` then `S` | Go to Settings |

---

## 🩺 Health Check

Run a full project audit:

```bash
cd client
npm run health
```

Checks: TypeScript errors, dependency conflicts, dead imports, missing env variables, build size (warns if chunk > 500KB), circular dependencies, `console.log` leftovers, and unused imports. Outputs a color-coded score out of 100.

---

## 🗺 Roadmap

- [x] Landing page with hero and features grid
- [x] Keyboard shortcuts (N, /, G+D/P/L/S)
- [x] Health check script (npm run health)
- [x] Semantic color system (btn-edit, btn-delete, btn-confirm)
- [x] Accessibility pass (aria-labels, focus trap, lazy loading)
- [ ] Backend API (Node.js + Express)
- [ ] Authentication and multi-device sync
- [ ] Mobile app (React Native)
- [ ] Figma integration
- [ ] Claude Code / Anthropic usage stats
- [ ] Custom widget builder

---

## 📄 License

MIT © Abdrahman Walied
