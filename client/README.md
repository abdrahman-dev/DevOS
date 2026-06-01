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
[![License MIT](https://img.shields.io/badge/MIT-yellow?style=flat-square)](LICENSE)

**DevOS frontend — React 18 + TypeScript + Vite 8 SPA. Works fully offline as guest.**

## Tech Stack

| Technology   | Version | Purpose                    |
| ------------ | ------- | -------------------------- |
| React        | 18      | UI framework               |
| TypeScript   | 5       | Type safety                |
| Vite         | 8       | Bundler and dev server     |
| Zustand      | 4       | State management           |
| Framer Motion| 12      | Animations                 |
| idb          | 8       | IndexedDB wrapper          |
| React Router | 6       | Client-side routing        |
| Lucide React | -       | Icons                      |
| Pure CSS     | -       | Styling (no Tailwind/UI)   |

## Project Structure

```
client/src/
├── components/   # ui/, layout/, cards/, widgets/
├── features/     # projects/, learning/, dashboard/
├── pages/        # Dashboard, Projects, Learning, Settings, Profile, People, Login, Register, Landing, PublicProfile
├── store/        # Zustand stores (projects, learning, settings, auth, friends)
├── db/           # IndexedDB layer (idb)
├── services/     # auth, profile, friends, github
├── hooks/        # useToast, useModal, useRequireAuth, useIntegrationData
├── types/        # TypeScript interfaces
├── utils/        # helpers + timeAgo
├── constants/    # Routes, status maps, defaults
└── styles/       # global.css
```

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server → http://localhost:5173
npm run build      # Production build → dist/
npm run health     # Run 8-check health audit
npx tsc -b --noEmit  # Type check without emitting
```

## Environment

```
VITE_API_URL=http://localhost:5000   # backend URL (optional for guest mode)
```

## Notes

- **Guest mode** — works fully offline without a backend. Projects, learning, settings, and GitHub widget all use IndexedDB.
- **Auth** — requires the backend at `server/auth/` to be running. Set `VITE_API_URL` accordingly.
- **CI/CD** — GitHub Actions runs type check + build on every push, then deploys to Vercel.
- **Docker** — multi-stage Dockerfile builds the app and serves via Nginx on port 80.
