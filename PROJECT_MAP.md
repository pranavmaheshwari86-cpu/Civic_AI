# Project Map

## Context
- **Stack:** Next.js (frontend) + Express/Node (backend) + Prisma (ORM) + MongoDB
- **Monorepo tool:** npm workspaces (`apps/*`, `packages/*`)
- **Package manager:** npm
- **Test framework:** Custom / To be determined (has `tests/` folder with `setup.ts`, `auth.test.ts`)
- **Deployment target:** Vercel (frontend) + possibly custom container/Railway (backend)
- **Working branch:** `cleanup/audit-2026-07-13`

## Workspaces
- `apps/web`: Next.js application
- `apps/api`: Backend Express application
- `packages/*`: Shared packages (if any)
