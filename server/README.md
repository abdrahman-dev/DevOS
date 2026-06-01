```
██████╗ ███████╗██╗   ██╗ ██████╗ ███████╗
██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔════╝
██║  ██║█████╗  ██║   ██║██║   ██║███████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║╚════██║
██████╔╝███████╗ ╚████╔╝ ╚██████╔╝███████║
╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚══════╝
```

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-auth-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3-3068b7?style=flat-square&logo=zod)](https://zod.dev/)
[![License MIT](https://img.shields.io/badge/MIT-yellow?style=flat-square)](LICENSE)

**DevOS auth server — Node.js + Express + MongoDB backend for authentication, profiles, and friend requests.**

## Tech Stack

| Technology | Version | Purpose                      |
| ---------- | ------- | ---------------------------- |
| Node.js    | 20      | Runtime                      |
| Express    | 5       | API framework                |
| MongoDB    | -       | Database + Mongoose ODM      |
| JWT        | -       | Dual-token auth (httpOnly)   |
| Zod        | 3       | Input validation             |
| bcryptjs   | -       | Password hashing             |

## Project Structure

```
server/auth/
├── app.js              # Express entry point
├── config/             # env.js (Zod + ESM-safe dotenv via createRequire)
├── controllers/
│   ├── auth/           # register, login, logout, refresh, me, verify, reset
│   ├── profile/        # getMyProfile, updateProfile, getPublicProfile, searchProfiles
│   └── friends/        # sendRequest, respondToRequest, getFriends, getPending, removeFriend
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   ├── errorHandler.js     # Global error handler
│   ├── rateLimiter.js      # Rate limiting
│   └── validate.js         # Zod schema-based validation
├── model/
│   ├── userModel.js
│   ├── refreshTokenModel.js
│   ├── friendRequest.js
│   └── mongodb.js
├── routes/
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   └── friendRoutes.js
└── utils/
    ├── authTokens.js    # Generate/verify access + refresh tokens
    └── logger.js
```

## Commands

```bash
cp .env.example .env   # Configure environment variables
npm install            # Install dependencies
npm run dev            # Start with nodemon (hot reload)
npm start              # Production start
```

## Endpoints

| Method | Endpoint                             | Auth | Description             |
| ------ | ------------------------------------ | ---- | ----------------------- |
| GET    | /health                              | ✗    | Health check            |
| POST   | /api/auth/register                   | ✗    | Register new user       |
| POST   | /api/auth/login                      | ✗    | Login                   |
| POST   | /api/auth/logout                     | ✗    | Clear cookies           |
| POST   | /api/auth/refresh                    | ✗    | Refresh access token    |
| GET    | /api/auth/me                         | ✓    | Get current user        |
| POST   | /api/auth/verify-email               | ✗    | Verify email OTP        |
| POST   | /api/auth/resend-otp                 | ✗    | Resend verification OTP |
| POST   | /api/auth/forgot-password            | ✗    | Request password reset  |
| POST   | /api/auth/reset-password             | ✗    | Reset password with OTP |
| POST   | /api/auth/change-password            | ✓    | Change password         |
| GET    | /api/profile/me                      | ✓    | Get my profile          |
| PUT    | /api/profile/me                      | ✓    | Update profile          |
| GET    | /api/profile/search?q=               | ✓    | Search users            |
| GET    | /api/profile/:username               | ✗    | Get public profile      |
| POST   | /api/friends/request/:userId         | ✓    | Send friend request     |
| PUT    | /api/friends/request/:requestId      | ✓    | Accept/reject request   |
| GET    | /api/friends                         | ✓    | List friends            |
| GET    | /api/friends/pending                 | ✓    | List pending requests   |
| DELETE | /api/friends/:userId                 | ✓    | Remove friend           |

## Environment Variables

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/devos
ACCESS_TOKEN_SECRET=your_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_secret_min_32_chars
NODE_ENV=development
```

## Security

- **Dual-token JWT** — short-lived access token + long-lived refresh token (both httpOnly cookies)
- **Password hashing** — bcryptjs with salt rounds
- **Rate limiting** — global + auth-specific rate limiters
- **Input validation** — Zod schemas on all mutation endpoints
- **ESM-safe dotenv** — env loaded synchronously via `createRequire` before any module imports

## Known Limitations

- **Email OTP is logged to console** — no SMTP/nodemailer configured yet
- **No refresh token rotation** — tokens are valid until expiry
- **Backend not deployed** — run locally with MongoDB for now
