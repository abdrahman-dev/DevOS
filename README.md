```
██████╗ ███████╗██╗   ██╗ ██████╗ ███████╗
██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔════╝
██║  ██║█████╗  ██║   ██║██║   ██║███████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║╚════██║
██████╔╝███████╗ ╚████╔╝ ╚██████╔╝███████║
╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚══════╝
```

[![React 18](https://img.shields.io/badge/React-18-4f8ef7?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-local-2a7a3b?style=flat-square&logo=sqlite)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License MIT](https://img.shields.io/badge/MIT-yellow?style=flat-square)](LICENSE)

**Your personal developer command center — local-first, open source, always yours.**

## What is DevOS?

DevOS is a local-first personal dashboard built for developers who want to stay organized without giving up their data. Track your projects, monitor your learning, connect with other developers, and sync your GitHub activity — all from one place.

The frontend runs entirely on IndexedDB: no uploads, no cloud syncing for your local data. The backend handles auth, profiles, and social features — secured with httpOnly cookie JWT auth.

---

## ✨ Features

### Core
- **Project tracker** — Full CRUD with status, priority, tags, GitHub/live URLs, notes, and search
- **Learning tracker** — Topics with progress bars, sources, and status badges
- **Quick notes** — Auto-saved scratchpad on your dashboard
- **GitHub widget** — Profile card, language breakdown with colored bars, recent repos

### Auth
- **Register & login** — Email + password with JWT dual-token auth (httpOnly cookies)
- **Email OTP verification** — Verify your email with a one-time code
- **Password reset** — Forgot password flow with OTP
- **Change password** — Update password while logged in

### Social
- **Public profiles** — Custom username, bio, avatar, location, website, social links
- **People search** — Find developers by name or username (debounced, min 2 chars)
- **Friend requests** — Send, accept, reject; pending badge in popover
- **Friends list** — View and remove friends from the People page

### Dashboard
- **Live GitHub widget** — Profile header, language stack, recent activity
- **Stat cards** — Quick overview of projects, learning progress, friends
- **Motivational quotes** — Daily quotes (English/Arabic), auto-dismiss
- **Focus mode** — Hides widgets, shows only learning + recent projects

### UX
- **Dark / Light theme** — Warm, eye-friendly palette (light mode never uses pure white)
- **Animated background** — Subtle floating particles
- **Mobile responsive** — Bottom nav, adaptive grids, 44px tap targets
- **Framer Motion** — Subtle page transitions and animations (max 0.2s, easeOut)

### DevOps
- **GitHub Actions CI/CD** — Type check + build on push, auto-deploy to Vercel
- **Docker + Nginx** — Multi-stage build, gzip, cache headers, SPA fallback, security headers
- **Health check script** — 8-check audit: types, deps, dead imports, env vars, build size, circular deps, console.logs, unused imports

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│  client/                    server/auth/                 │
│  ────────                   ────────────                 │
│  React 18 SPA               Node.js + Express 5         │
│  Vite 8 + Pure CSS          MongoDB + Mongoose 9        │
│  Zustand 5 state            JWT auth (httpOnly cookies) │
│  IndexedDB (idb)            Zod validation              │
│  Framer Motion              bcryptjs + rate limiting    │
│                                                         │
│  Pages:                     Endpoints:                  │
│  / /dashboard /projects     /api/auth/*                 │
│  /learning /settings        /api/profile/*              │
│  /login /register           /api/friends/*              │
│  /profile /people           /health                     │
└─────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

| Technology   | Version | Purpose                          |
| ------------ | ------- | -------------------------------- |
| React        | 18      | UI framework                     |
| TypeScript   | 5       | Type safety                      |
| Vite         | 8       | Bundler and dev server           |
| Zustand      | 4       | State management                 |
| Framer Motion| 12      | Animations                       |
| idb          | 8       | IndexedDB wrapper                |
| React Router | 6       | Client-side routing              |
| Express      | 5       | Backend API                      |
| MongoDB      | -       | Database + Mongoose ODM          |
| Zod          | 3       | Input validation                 |
| bcryptjs     | -       | Password hashing                 |

## 📁 Project Structure

```
ProjoMood/
├── client/
│   ├── src/
│   │   ├── components/      # ui/, layout/, cards/, widgets/
│   │   ├── features/        # projects/, learning/, dashboard/
│   │   ├── pages/           # Dashboard, Projects, Learning, Settings, Profile, People, Login, Register, Landing
│   │   ├── store/           # Zustand stores (projects, learning, settings, auth, friends)
│   │   ├── db/              # IndexedDB layer (idb)
│   │   ├── services/        # auth, profile, friends, github
│   │   ├── hooks/           # useToast, useModal, useRequireAuth, useIntegrationData
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # helpers + timeAgo
│   │   ├── constants/       # Routes, status maps, defaults
│   │   └── styles/          # global.css
│   ├── scripts/             # health-check.ts
│   ├── .npmrc               # legacy-peer-deps=true
│   └── vite.config.ts
├── server/
│   └── auth/
│       ├── app.js           # Entry point
│       ├── config/          # env validation (Zod + ESM-safe dotenv)
│       ├── controllers/     # auth/, profile/, friends/
│       ├── middleware/      # authMiddleware, errorHandler, rateLimiter, validate
│       ├── model/           # userModel, refreshToken, friendRequest, mongodb
│       ├── routes/          # authRoutes, profileRoutes, friendRoutes
│       └── utils/           # authTokens, logger
├── .github/workflows/       # CI/CD → Vercel
├── Dockerfile               # Multi-stage: Node build → Nginx serve
├── docker-compose.yml
├── nginx.conf               # Gzip, cache, SPA fallback, security headers
└── README.md
```

---

## 🛠 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (for full-stack features)
- Docker (optional, for containerized deployment)

### Frontend only (guest mode — no backend needed)

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

Works fully offline. Projects, learning tracker, settings, and GitHub widget all use IndexedDB.

### Full stack (auth + profiles + friends)

```bash
# Terminal 1 — Backend
cd server/auth
cp .env.example .env   # fill in your values
npm install
npm run dev

# Terminal 2 — Frontend
cd client
npm install
npm run dev
```

### Docker (frontend only)

```bash
docker compose up --build
# → http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (`server/auth/.env`)

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/devos
ACCESS_TOKEN_SECRET=your_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_secret_min_32_chars
NODE_ENV=development
```

### Frontend (`client/.env.local`)

```
VITE_API_URL=http://localhost:5000
```

---

## ⚠️ Known Limitations

- **Email OTP is logged to console in development** — nodemailer not configured yet
- **Public profile tabs (Projects/Learning) show empty state** — public item sharing coming soon
- **Friend requests require both users to have accounts** — no guest social features
- **Backend not yet deployed** — run locally for full-stack features
- **Health check script references removed services** — needs update

---

## 🗺 Roadmap

- [x] Local-first project + learning tracker (IndexedDB)
- [x] JWT auth with email OTP verification
- [x] Public profiles + people search
- [x] Friend requests system (send, accept, reject, list)
- [x] GitHub integration widget (profile, languages, repos)
- [x] CI/CD pipeline → Vercel
- [x] Docker + Nginx deployment
- [x] Health check script
- [ ] Email delivery (nodemailer + SMTP)
- [ ] Public project/learning sharing on profiles
- [ ] Backend deployment (Railway / Render)
- [ ] Notifications for friend requests
- [ ] Mobile app (React Native)

---

## 📄 License

MIT © Abdrahman Walied
