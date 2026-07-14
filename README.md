<div align="center">

# 🇮🇳 CivicAI — AI-Powered Civic Companion

**Empowering Indian citizens with intelligent access to government services, complaint resolution, and scheme discovery.**

[![CI](https://github.com/pranavmaheshwari86-cpu/Civic_AI/actions/workflows/ci.yml/badge.svg)](https://github.com/pranavmaheshwari86-cpu/Civic_AI/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🎯 Problem Statement

Indian citizens face significant barriers navigating fragmented government portals, understanding eligibility for 1000+ welfare schemes, and filing civic complaints effectively. Language barriers, bureaucratic complexity, and lack of digital literacy compound these challenges — especially for rural and underserved populations.

## 💡 Solution

**CivicAI** is an AI-powered conversational platform that acts as a single intelligent gateway to government services. Citizens can:

- **Ask questions in natural language** (English or Hindi) and receive actionable, verified guidance
- **Discover government schemes** they're eligible for, with document checklists
- **File and track civic complaints** with geolocation, photo evidence, and real-time status updates
- **Get document guidance** — understand what documents are needed and where to get them

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│  Chat UI · Complaint Flow · Scheme Discovery · Admin CMS    │
│  i18n (Hindi/English) · Dark/Light Theme · SSE Streaming    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST + SSE
┌──────────────────────▼──────────────────────────────────────┐
│                    Backend (NestJS 10)                       │
│  Auth (OTP) · Chat · Complaints · Catalog · Admin · Feedback│
│  Throttling · Helmet · CORS · Sentry Error Tracking         │
├─────────────────────────────────────────────────────────────┤
│  AI Services (Multi-Provider)                               │
│  Google Gemini 1.5 Flash → Anthropic Claude → Mock Fallback │
│  Voyage AI Embeddings · Atlas Vector Search                 │
├─────────────────────────────────────────────────────────────┤
│  Background Jobs (BullMQ Worker)                            │
│  Re-embedding · Duplicate Detection · Scheduled Scans       │
└─────────────┬───────────────────┬───────────────────────────┘
              │                   │
    ┌─────────▼─────────┐  ┌─────▼─────────┐
    │  MongoDB Atlas     │  │  Redis         │
    │  9 Collections     │  │  Sessions,     │
    │  Vector Search     │  │  OTP Cache,    │
    │  2dsphere Index    │  │  BullMQ Queues │
    └───────────────────┘  └───────────────┘
```

### Monorepo Structure

```
├── apps/
│   ├── api/          # NestJS 10 REST API (TypeScript)
│   ├── web/          # Next.js 14 Frontend (App Router, TypeScript)
│   └── worker/       # BullMQ Background Worker (TypeScript)
├── packages/
│   └── shared-types/ # Shared TypeScript interfaces
├── memory/           # Project documentation & knowledge base
├── .github/
│   └── workflows/    # CI/CD (GitHub Actions)
├── docker-compose.yml
└── package.json      # npm workspaces root
```

---

## ✨ Key Features

### 🤖 AI-Powered Chat
- **Multi-provider AI**: Google Gemini 1.5 Flash (primary) → Anthropic Claude (fallback) → Mock (graceful degradation)
- **Intent classification**: Automatic categorization of user queries (document info, complaints, scheme lookup, general)
- **Circuit breaker**: Automatic failover after 5 consecutive failures with 60s cooldown
- **SSE streaming**: Real-time response delivery
- **Conversation persistence**: Full chat history with context window

### 📋 Complaint Management
- **One-click filing**: Guided complaint submission with category selection
- **Geolocation**: Automatic address resolution via Google Maps Geocoding
- **Photo evidence**: Up to 3 photos per complaint via Cloudflare R2
- **Duplicate detection**: Geospatial queries ($nearSphere, 100m radius, 14-day window)
- **Real-time tracking**: Unique `SB-XXXXXXXX` tracking IDs with status timeline

### 🔍 Scheme Discovery
- **Semantic search**: Voyage AI embeddings + MongoDB Atlas Vector Search (cosine similarity ≥ 0.75)
- **Document checklists**: Per-service required document lists with conditional requirements
- **Bilingual content**: Full Hindi and English support for all scheme data

### 🔐 Security
- **OTP authentication**: MSG91 SMS → bcrypt hashing → Redis (5-min TTL) → JWT tokens
- **Admin JWT protection**: Dedicated `AdminJwtStrategy` with separate `ADMIN_JWT_SECRET`
- **Global rate limiting**: NestJS ThrottlerGuard (10 req/min default)
- **Helmet CSP**: Security headers on all responses
- **CORS**: Restricted to configured frontend URL
- **Input validation**: DTO validation pipes with whitelist mode

### 🌐 Accessibility & i18n
- **Bilingual**: Hindi (हिंदी) and English with persistent locale switching
- **WCAG 2.1 AA**: Semantic HTML, ARIA labels, keyboard navigation
- **Dark/Light theme**: System-aware with manual toggle
- **Responsive**: Mobile-first design with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | NestJS 10, Express, TypeScript, Passport.js |
| **Database** | MongoDB Atlas (Vector Search, 2dsphere indexes) |
| **Cache/Queue** | Redis 7, BullMQ |
| **AI** | Google Gemini 1.5 Flash, Anthropic Claude, Voyage AI |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **SMS** | MSG91 (DLT-registered) |
| **Maps** | Google Maps Geocoding API |
| **Monitoring** | Sentry (Error tracking) |
| **CI/CD** | GitHub Actions → Railway (3-service deploy) |
| **i18n** | next-intl (Hindi + English) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.x
- **Docker** (for MongoDB + Redis) or standalone instances
- **npm** ≥ 10.x

### 1. Clone & Install

```bash
git clone https://github.com/pranavmaheshwari86-cpu/Civic_AI.git
cd Civic_AI
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts MongoDB 6.0 on port `27017` and Redis 7.0 on port `6379`.

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Run Development Servers

```bash
# Terminal 1 — API (port 3000)
npm run dev:api

# Terminal 2 — Frontend (port 3001)
npm run dev:web

# Terminal 3 — Worker
npm run dev:worker
```

### 5. Open

Navigate to [http://localhost:3001](http://localhost:3001)

---

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Build all workspaces
npm run build

# Lint all workspaces
npm run lint
```

---

## 📁 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/healthz` | — | Health check (MongoDB + Redis) |
| `POST` | `/api/v1/auth/request-otp` | — | Request SMS OTP |
| `POST` | `/api/v1/auth/verify-otp` | — | Verify OTP, get JWT |
| `POST` | `/api/v1/chat` | Optional | Send chat message (SSE) |
| `POST` | `/api/v1/complaints` | — | File a complaint |
| `GET` | `/api/v1/complaints/:id` | — | Track complaint by ID |
| `POST` | `/api/v1/complaints/upload-url` | JWT | Get presigned upload URL |
| `GET` | `/api/v1/catalog/search` | — | Semantic search services |
| `POST` | `/api/v1/admin/auth/login` | — | Admin login |
| `GET` | `/api/v1/admin/catalog/services` | Admin JWT | List catalog entries |
| `POST` | `/api/v1/admin/catalog/services` | Admin JWT | Create catalog entry |
| `PATCH` | `/api/v1/admin/catalog/services/:id` | Admin JWT | Update catalog entry |
| `DELETE` | `/api/v1/admin/catalog/services/:id` | Admin JWT | Delete catalog entry |
| `GET` | `/api/v1/admin/complaints` | Admin JWT | List complaints |
| `PATCH` | `/api/v1/admin/complaints/:id/status` | Admin JWT | Update complaint status |

---

## 🏛️ Database Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Citizen accounts (phone-based) |
| `admin_users` | Admin CMS accounts |
| `conversations` | Chat session metadata |
| `messages` | Chat messages with intent classification |
| `service_catalog` | Government services (vector-indexed) |
| `scheme_catalog` | Welfare schemes (vector-indexed) |
| `complaints` | Civic complaints (geospatially indexed) |
| `complaint_status_updates` | Complaint status timeline |
| `feedbacks` | User feedback on AI responses |

---

## 👥 Team

**Team Devengers** — Built for the AI Hackathon 2026

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🎭 Playwright MCP & Testing

This project includes the official **Playwright MCP Server** (`@playwright/mcp`) and End-to-End testing via `@playwright/test`. This setup allows AI agents to inspect and automate the browser for development, testing, and visual verification.

### How to use Playwright MCP

The MCP server configuration is located in `mcp.json` at the root of the project. If you are using an AI assistant like Cline or Claude Desktop, you can register it using:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

### Running Tests

We have configured Playwright with sensible defaults in `playwright.config.ts`, including automatic screenshots on failure, video retention on failure, and Chromium + Mobile testing.

1. Ensure the development server is running (`npm run dev:web`).
2. Run the tests:
   ```bash
   npx playwright test
   ```
3. To view the HTML report (including traces and videos):
   ```bash
   npx playwright show-report
   ```

### Troubleshooting
- **Tests timing out:** Ensure your local dev server is running on `http://localhost:3000`.
- **Browser launch failures:** Run `npx playwright install --with-deps` to ensure all browser binaries are present.
