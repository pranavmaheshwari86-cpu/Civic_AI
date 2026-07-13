# Graph Report - Devengers  (2026-07-13)

## Corpus Check
- 244 files · ~232,782 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1815 nodes · 2084 edges · 229 communities (138 shown, 91 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4eb317af`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Complaint Management
- CivicAI Platform & Architecture
- Task Management API
- CivicAI Platform & Architecture
- CivicAI Platform & Architecture
- Frontend UI Components
- Project Memory & Docs
- CI/CD & Workflows
- CivicAI Platform & Architecture
- Admin CMS
- Authentication & Security
- Authentication & Security
- Admin CMS
- Admin CMS
- Community 14
- Community 15
- Community 16
- Authentication & Security
- Authentication & Security
- Authentication & Security
- Authentication & Security
- Authentication & Security
- Scheme Discovery & Catalog
- Scheme Discovery & Catalog
- Scheme Discovery & Catalog
- Scheme Discovery & Catalog
- AI Chat & RAG Pipeline
- AI Chat & RAG Pipeline
- AI Chat & RAG Pipeline
- Admin CMS
- Authentication & Security
- Data Layer
- Admin CMS
- Admin CMS
- Scheme Discovery & Catalog
- Scheme Discovery & Catalog
- Complaint Management
- Complaint Management
- Complaint Management
- Complaint Management
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Scheme Discovery & Catalog
- Scheme Discovery & Catalog
- Community 48
- Community 49
- Complaint Management
- Complaint Management
- Complaint Management
- Complaint Management
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Complaint Management
- Admin CMS
- Community 64
- Community 65
- AI Chat & RAG Pipeline
- AI Chat & RAG Pipeline
- Community 68
- Community 69
- AI Chat & RAG Pipeline
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- Frontend UI Components
- E2E Testing
- E2E Testing
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Project Memory & Docs
- Project Memory & Docs
- Project Memory & Docs
- CivicAI Platform & Architecture
- Scheme Discovery & Catalog
- AI Chat & RAG Pipeline
- Complaint Management
- Community 99
- Community 100
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Authentication & Security
- Task Management API
- Task Management API
- Task Management API
- Authentication & Security
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Task Management API
- Community 122
- 5.8 Execution Checkpoints
- test-mongo.js
- SchemeMatchDto
- next.config.mjs
- index.ts
- seed.ts
- update-tailwind.js
- @anthropic-ai/sdk
- @aws-sdk/client-s3
- @aws-sdk/s3-request-presigner
- bcrypt
- bullmq
- class-transformer
- class-validator
- @googlemaps/google-maps-services-js
- mongoose
- nanoid
- @nestjs/bullmq
- @nestjs/common
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- @nestjs/mongoose
- @nestjs/passport
- @nestjs/platform-express
- @nestjs/throttler
- passport
- reflect-metadata
- rxjs
- @sentry/profiling-node
- voyageai
- crawler.spec.ts
- middleware.ts
- next-env.d.ts
- postcss.config.mjs
- tailwind.config.ts
- 2.5 Complexity Scoring Engine
- GitHub Actions CI Pipeline
- express
- express-rate-limit
- jsonwebtoken
- @prisma/client
- rate-limit-redis
- refactor-dashboard.js
- swagger-jsdoc
- ioredis
- zod
- database.ts
- Authentication Flow (Phone OTP + JWT)
- Chat RAG Data Flow (SSE Streaming)
- Complaint Filing Flow (Deduplication + Tracking)
- Modular Monolith Pattern (NestJS)
- Coding Standards (TypeScript, NestJS)
- Current Project Status (v1 Code Complete)
- Database Schema (9 MongoDB Collections)
- Architecture Decisions (Tech Choices)
- Deployment Strategy (Railway, CI/CD)
- Project Overview (CivicAI Goals)
- Anthropic Claude (Sonnet + Haiku)
- NestJS 10 (DI, Guards, Pipes)
- Next.js 14 (App Router, SSR)
- TanStack Query (Server State Cache)
- Zustand (Ephemeral UI State)
- Todo List (Remaining Work)
- BullMQ Background Worker
- Circuit Breaker (LLM Fallback)
- OTP Authentication (MSG91 + Redis + JWT)
- Voyage AI Embeddings
- Task API Structure (Prisma, PostgreSQL)
- fix.js
- 2.1 Intent Parsing
- 2.3 Multi-turn Awareness
- 2.4 Domain Classification
- CatalogTab.tsx
- @anthropic-ai/sdk

## God Nodes (most connected - your core abstractions)
1. `Confirmed Decisions` - 31 edges
2. `scripts` - 19 edges
3. `compilerOptions` - 19 edges
4. `compilerOptions` - 18 edges
5. `cn()` - 18 edges
6. `ChatService` - 17 edges
7. `AdminService` - 16 edges
8. `Autonomous Task Router v6` - 16 edges
9. `compilerOptions` - 15 edges
10. `AuthService` - 14 edges

## Surprising Connections (you probably didn't know these)
- `E2E Screenshot: Complaints Page Desktop` --conceptually_related_to--> `📋 Complaint Management`  [INFERRED]
  apps/web/e2e/screenshots/_en_complaints_desktop.png → README.md
- `E2E Screenshot: Schemes Page Desktop` --conceptually_related_to--> `🔍 Scheme Discovery`  [INFERRED]
  apps/web/e2e/screenshots/_en_schemes_desktop.png → README.md
- `E2E Screenshot: Chat Page Desktop` --conceptually_related_to--> `AI-Powered Chat (Multi-Provider)`  [INFERRED]
  apps/web/e2e/screenshots/_en_chat_desktop.png → README.md
- `GitHub Actions CI Pipeline` --references--> `CivicAI Platform`  [INFERRED]
  .github/workflows/ci.yml → README.md
- `React Doctor Lint Workflow` --references--> `React Doctor Skill (Button Type, LazyMotion, Component Size)`  [INFERRED]
  .github/workflows/react-doctor.yml → .claude/skills/react-doctor/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core AI Processing Pipeline** — memory_architecture_chat_flow, memory_tech_stack_anthropic_claude, readme_voyage_ai_embeddings, readme_mongodb_atlas [EXTRACTED 0.95]
- **Complaint Lifecycle (Filing, Tracking, Dedup)** — memory_architecture_complaint_flow, readme_complaint_management, readme_mongodb_atlas, readme_redis [EXTRACTED 0.95]
- **Authentication and Security Stack** — readme_security_otp_auth, memory_architecture_auth_flow, readme_redis, security_md_owasp [INFERRED 0.85]
- **E2E Test Coverage (All Main Pages)** — apps_web_e2e_screenshots_chat_screenshot, apps_web_e2e_screenshots_complaints_screenshot, apps_web_e2e_screenshots_dashboard_screenshot, apps_web_e2e_screenshots_home_screenshot, apps_web_e2e_screenshots_schemes_screenshot [EXTRACTED 0.95]
- **Project Memory / Knowledge Base** — memory_readme_md_memory_system, memory_architecture_modular_monolith, memory_database_md_schema, memory_decisions_md_decisions, memory_current_status_v1 [INFERRED 0.85]

## Communities (229 total, 91 thin omitted)

### Community 0 - "Complaint Management"
Cohesion: 0.07
Nodes (26): E2E Screenshot: Complaints Page Desktop, E2E Screenshot: Schemes Page Desktop, 1. Clone & Install, 2. Start Infrastructure, 3. Configure Environment, 4. Run Development Servers, 5. Open, 🌐 Accessibility & i18n (+18 more)

### Community 2 - "Task Management API"
Cohesion: 0.15
Nodes (11): authenticate(), express, Request, taskRepository, userRepository, AppError, ConflictError, ForbiddenError (+3 more)

### Community 3 - "CivicAI Platform & Architecture"
Cohesion: 0.67
Nodes (3): Docker Compose Infrastructure (MongoDB + Redis), MongoDB Atlas (Vector Search), Redis (Sessions, OTP, BullMQ)

### Community 9 - "Admin CMS"
Cohesion: 0.07
Nodes (24): AdminController, AdminLoginDto, CreateCatalogDto, Body, Controller, Get, HttpCode, IsOptional (+16 more)

### Community 10 - "Authentication & Security"
Cohesion: 0.04
Nodes (49): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+41 more)

### Community 11 - "Authentication & Security"
Cohesion: 0.12
Nodes (15): 1️⃣ Document Metadata, 2️⃣ Requirement Validation Summary, 3️⃣ Coverage & Matching Metrics, 4️⃣ Key Gaps / Risks, Test TC001 Sign in with valid credentials, Test TC002 Block dashboard access without authentication, Test TC003 View the login form, Test TC004 View the landing page introduction (+7 more)

### Community 12 - "Admin CMS"
Cohesion: 0.12
Nodes (14): AdminModule, Module, AppModule, Module, AuthModule, Module, RedisModule, Module (+6 more)

### Community 13 - "Admin CMS"
Cohesion: 0.04
Nodes (47): eslint-plugin-jest, jest-mock-extended, prisma, devDependencies, eslint, eslint-plugin-jest, jest, jest-mock-extended (+39 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (39): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, lucide-react, next, next-intl (+31 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (33): Confirmed Decisions, D10: Fixed complaint taxonomy (6 categories), D11: Modular monolith, not microservices, D12: MongoDB Atlas (not PostgreSQL), D13: Voyage AI for embeddings (not self-hosted), D14: Cloudflare R2 for blob storage (not S3), D15: Railway for hosting (not Kubernetes/AWS), D16: MSG91 for SMS/OTP (not Twilio) (+25 more)

### Community 17 - "Authentication & Security"
Cohesion: 0.33
Nodes (6): AuthController, Body, Controller, HttpCode, Post, Res

### Community 18 - "Authentication & Security"
Cohesion: 0.22
Nodes (8): 1️⃣ Document Metadata, 2️⃣ Requirement Validation Summary, 3️⃣ Coverage & Matching Metrics, 4️⃣ Key Gaps / Risks, Requirement: Authentication - Admin Login, Requirement: Authentication - OTP Request, Requirement: Catalog - Service Search, TestSprite AI Testing Report(MCP)

### Community 19 - "Authentication & Security"
Cohesion: 0.13
Nodes (15): RequestOtpDto, IsString, VerifyOtpDto, AuthService, Inject, Injectable, InjectModel, JwtStrategy (+7 more)

### Community 20 - "Authentication & Security"
Cohesion: 0.14
Nodes (11): JwtAuthGuard, Injectable, FileComplaintDto, GetUploadUrlDto, IsOptional, IsString, nanoid, Injectable (+3 more)

### Community 21 - "Authentication & Security"
Cohesion: 0.06
Nodes (32): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+24 more)

### Community 22 - "Scheme Discovery & Catalog"
Cohesion: 0.14
Nodes (13): 10. Build Verification, 11. Rollback Instructions, 12. Before/After Tree, 1. Summary, 2. Dependency Graph, 3. Duplicate Findings (Unactioned Suggestions), 4. Deleted Files, 5. Git-History Overrides (Risk: HIGH - Auto-KEPT) (+5 more)

### Community 23 - "Scheme Discovery & Catalog"
Cohesion: 0.07
Nodes (25): CatalogController, SchemeMatchDto, Body, Controller, Get, HttpCode, IsOptional, IsString (+17 more)

### Community 24 - "Scheme Discovery & Catalog"
Cohesion: 0.06
Nodes (32): author, dependencies, bullmq, dotenv, ioredis, mongoose, voyageai, description (+24 more)

### Community 25 - "Scheme Discovery & Catalog"
Cohesion: 0.07
Nodes (29): ES2022, ./node_modules/@types, ./src/types, **/*.test.ts, tests, compilerOptions, baseUrl, declaration (+21 more)

### Community 26 - "AI Chat & RAG Pipeline"
Cohesion: 0.07
Nodes (33): ChatController, SendMessageDto, Body, Controller, Get, HttpCode, IsOptional, IsString (+25 more)

### Community 27 - "AI Chat & RAG Pipeline"
Cohesion: 0.33
Nodes (5): Circular Dependencies, Dependency Graph, Missing Dependencies, Unused Exports (ts-prune), Unused Packages (depcheck)

### Community 28 - "AI Chat & RAG Pipeline"
Cohesion: 0.07
Nodes (28): Admin, API Documentation, Auth, Auth Architecture, Catalog & Schemes, Chat, Complaints, `DELETE /api/v1/admin/catalog/services/:id` (+20 more)

### Community 29 - "Admin CMS"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, eslint-config-next, @playwright/test, postcss, tailwindcss, @types/node, @types/react (+19 more)

### Community 31 - "Data Layer"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 32 - "Admin CMS"
Cohesion: 0.19
Nodes (16): AdminUser, AdminUserDocument, AdminUserSchema, Prop, Schema, Complaint, ComplaintLocation, ComplaintSchema (+8 more)

### Community 33 - "Admin CMS"
Cohesion: 0.15
Nodes (12): express, jest, node, authController, taskController, asyncHandler(), cacheKeys, globalForRedis (+4 more)

### Community 34 - "Scheme Discovery & Catalog"
Cohesion: 0.50
Nodes (4): EXCLUDES, fs, generateTree(), path

### Community 35 - "Scheme Discovery & Catalog"
Cohesion: 0.50
Nodes (3): Context, Project Map, Workspaces

### Community 36 - "Complaint Management"
Cohesion: 0.20
Nodes (10): 2.2 Hidden Requirement Detection, 2.6 Confidence Scoring, 2.7 Risk Assessment, Confidence Components, Confidence Thresholds and Actions, Detection Heuristics by Domain, Hidden Requirement Injection Rules, Part 2 — Intent Intelligence (+2 more)

### Community 37 - "Complaint Management"
Cohesion: 0.08
Nodes (25): 3.1 Skill Discovery, 3.2 MCP Discovery, 3.3 Agent Discovery, 3.4 Hosted Runtime Discovery, 3.5 Environment Manifest, 3.6 Capability Cache, 3.7 Conflict Resolution, 3.8 Framework Prioritization (+17 more)

### Community 38 - "Complaint Management"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 39 - "Complaint Management"
Cohesion: 0.09
Nodes (22): 4.1 Skill Selection, 4.2 Agent Allocation, 4.3 MCP Allocation, 4.4 Token Budget Engine, 4.5 Context Compression, 4.6 Parallel Scheduling, 4.7 Dependency Graph, 4.8 Cost Optimization (+14 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (19): 1. Overview, 2. Colors, 3. Typography, 4. Elevation, 5. Components, 6. Do's and Don'ts, Buttons, Cards / Containers (+11 more)

### Community 41 - "Community 41"
Cohesion: 0.10
Nodes (20): 6.1 Validation Registry, 6.2 Security Gates, 6.3 Performance Gates, 6.4 Architecture Gates, 6.5 Reality Checker, 6.6 AI Evaluation, 6.7 Recovery Engine, 6.8 Retry Logic (+12 more)

### Community 42 - "Community 42"
Cohesion: 0.11
Nodes (19): Feedback, FeedbackDocument, FeedbackSchema, Prop, Schema, FeedbackController, SubmitFeedbackDto, Body (+11 more)

### Community 43 - "Community 43"
Cohesion: 0.11
Nodes (18): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+10 more)

### Community 44 - "Community 44"
Cohesion: 0.11
Nodes (18): compilerOptions, allowSyntheticDefaultImports, declaration, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, resolveJsonModule (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (17): author, description, keywords, license, name, private, scripts, build (+9 more)

### Community 46 - "Scheme Discovery & Catalog"
Cohesion: 0.11
Nodes (19): scripts, build, db:generate, db:migrate, db:migrate:deploy, db:push, db:seed, db:studio (+11 more)

### Community 47 - "Scheme Discovery & Catalog"
Cohesion: 0.11
Nodes (17): API Endpoints, Authentication, Documentation, Environment Variables, Features, Installation, License, Prerequisites (+9 more)

### Community 48 - "Community 48"
Cohesion: 0.12
Nodes (17): bcryptjs, compression, cors, morgan, swagger-ui-express, dependencies, bcryptjs, compression (+9 more)

### Community 49 - "Community 49"
Cohesion: 0.12
Nodes (15): 1. `users`, 2. `conversations`, 3. `messages`, 4. `service_catalog`, 5. `scheme_catalog`, 6. `complaints`, 7. `complaint_status_updates`, 8. `feedback` (+7 more)

### Community 50 - "Complaint Management"
Cohesion: 0.14
Nodes (11): ComplaintsController, Body, Controller, Get, HttpCode, Param, Post, UseGuards (+3 more)

### Community 51 - "Complaint Management"
Cohesion: 0.13
Nodes (14): ALWAYS-ON GLOBALS, Always-On (mandatory, every task, no exceptions):, AUTO ROUTING MAP, GLOBAL TASK ORCHESTRATION PROTOCOL, OUTPUT FORMAT (every response), Per-Task Selection (dynamic — no lazy loading):, Required output before execution:, STEP 1 — CAPABILITY DISCOVERY (+6 more)

### Community 52 - "Complaint Management"
Cohesion: 0.11
Nodes (19): 5.1 Sequential Pipeline, 5.2 Parallel Pipeline, 5.3 Hybrid Pipeline, 5.4 Fan-out / Fan-in, 5.5 Tree of Thought, 5.6 Reflection Loop, 5.7 Multi-agent Coordination, 5.8 Execution Checkpoints (+11 more)

### Community 53 - "Complaint Management"
Cohesion: 0.14
Nodes (12): Commands, Config shape, Decision guide, Educating the user, Explaining and configuring rules, Workflow, After making React code changes:, Command (+4 more)

### Community 54 - "Community 54"
Cohesion: 0.19
Nodes (9): DocumentController, Body, Controller, HttpCode, Post, DocumentModule, Module, DocumentService (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (12): Architecture, Authentication Flow, Backend Architecture, Chat (Primary Flow A), Circuit Breaker (LLM Fallback), Complaint (Primary Flow B), Data Flow, Folder Structure (Monorepo) (+4 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (12): `apps/api` (and `apps/worker` shares most), `apps/web`, `apps/worker` (additional), CI/CD, Deployment, Environment Variables, Environments, Hosting (+4 more)

### Community 57 - "Community 57"
Cohesion: 0.17
Nodes (12): 7.1 Complete JSON Schema, 7.2 Environment Rules, 7.3 Dynamic Capability Rules, 7.5 Global Rules, 7.6 Best Practices, Communication Best Practices, Execution Quality Best Practices, Execution Rules (+4 more)

### Community 58 - "Community 58"
Cohesion: 0.18
Nodes (10): Accessibility (WCAG 2.1 AA — Non-Negotiable), Backend (NestJS), Coding Standards, Error Handling, Frontend (Next.js), Git / CI, Language & Tooling, Performance (+2 more)

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (10): Priority 0 — Pre-Engineering (Start Immediately), Priority 1 — Project Setup, Priority 2 — Backend Core, Priority 3 — Frontend Core, Priority 4 — Worker Jobs, Priority 5 — Content & Data, Priority 6 — Testing & Quality, Priority 7 — Launch Prep (+2 more)

### Community 60 - "Community 60"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, scripts, test (+2 more)

### Community 62 - "Complaint Management"
Cohesion: 0.47
Nodes (5): ComplaintDetail, ComplaintDetailDrawer(), ComplaintDetailDrawerProps, getPriorityClass(), getStatusClass()

### Community 63 - "Admin CMS"
Cohesion: 0.10
Nodes (20): 1.1 Executive Mission, 1.2 Design Principles, 1.3 Router State Machine, 1.4 Phase Overview, 1.5 Global Constraints, 1.6 Execution Lifecycle, Capability Constraints, Execution Constraints (+12 more)

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): applications, colorMap, IconMap

### Community 66 - "AI Chat & RAG Pipeline"
Cohesion: 0.18
Nodes (12): ChatPage(), Message, Message, useChat(), ComplaintsPage(), DashboardPage(), LoginPage(), CatalogItem (+4 more)

### Community 67 - "AI Chat & RAG Pipeline"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.16
Nodes (10): geistMono, geistSans, metadata, RootLayout(), Providers(), Footer(), Header(), LanguageToggle() (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.29
Nodes (6): Completed, Current Status, Implementation State, In Progress, Known Limitations (v1), Not Started

### Community 70 - "AI Chat & RAG Pipeline"
Cohesion: 0.20
Nodes (10): SUGGESTED_PROMPTS, SuggestedPromptsList(), MobileNav(), EmptyState(), EmptyStateProps, Input, InputProps, PlaceholderImage() (+2 more)

### Community 71 - "Frontend UI Components"
Cohesion: 0.22
Nodes (8): 1️⃣ Document Metadata, 2️⃣ Requirement Validation Summary, 3️⃣ Coverage & Matching Metrics, 4️⃣ Key Gaps / Risks, Test TC001 post api v1 auth otp request with valid and invalid phone numbers, Test TC002 post api v1 admin auth login with valid and invalid credentials, Test TC003 get api v1 services search with valid and invalid queries, TestSprite AI Testing Report(MCP)

### Community 72 - "Frontend UI Components"
Cohesion: 0.20
Nodes (9): AI/ML, Constraints, Database, Frameworks, Libraries, Package Manager, Repo Structure, Tech Stack (+1 more)

### Community 73 - "Frontend UI Components"
Cohesion: 0.20
Nodes (9): AI Safety, Authentication & Authorization, Data Protection, Infrastructure Security, Monitoring, Reporting a Vulnerability, Security Measures Implemented, Security Policy (+1 more)

### Community 75 - "Frontend UI Components"
Cohesion: 0.22
Nodes (9): dependencies, @aws-sdk/client-s3, ioredis, passport-jwt, @sentry/node, ioredis, @aws-sdk/client-s3, passport-jwt (+1 more)

### Community 76 - "Frontend UI Components"
Cohesion: 0.22
Nodes (8): CitizenProfile, Complaint, Department, FaqItem, GovernmentScheme, NewsItem, Policy, Reminder

### Community 77 - "Frontend UI Components"
Cohesion: 0.29
Nodes (5): ChatInput, ChatInputProps, EmergencyModalProps, Button(), buttonVariants

### Community 78 - "Frontend UI Components"
Cohesion: 0.22
Nodes (8): Accessibility & Inclusion, Anti-references, Brand Personality, Design Principles, Product, Product Purpose, Register, Users

### Community 79 - "Frontend UI Components"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 80 - "Frontend UI Components"
Cohesion: 0.12
Nodes (19): app, corsOptions, envSchema, parsed, options, swaggerSpec, gracefulShutdown(), server (+11 more)

### Community 81 - "Frontend UI Components"
Cohesion: 0.22
Nodes (8): CardBody(), CardBodyProps, CardContainerProps, CardContext, CardContextValue, CardGlare(), CardItemProps, useCard()

### Community 82 - "Frontend UI Components"
Cohesion: 0.33
Nodes (4): InjectModel, InjectQueue, ComplaintDocument, InjectModel

### Community 83 - "Frontend UI Components"
Cohesion: 0.22
Nodes (8): Antigravity Elite Orchestration Engine, Appendix A — Routing Plan Shorthand (Low Complexity), Appendix B — Capability Substitution Map, Appendix C — Skill Tier Quick Reference, Appendix D — Execution Pattern Quick Reference, Appendix E — Validation Gate Quick Reference, Appendix F — Agent Selection Quick Reference, Autonomous Task Router v6

### Community 84 - "Frontend UI Components"
Cohesion: 0.40
Nodes (5): 7.4 Routing Examples, Example 1: Low Complexity — Simple Bug Fix, Example 2: Medium Complexity — API Integration, Example 3: High Complexity — RAG System, Example 4: Enterprise Complexity — Full Product Build

### Community 88 - "Community 88"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 89 - "Community 89"
Cohesion: 0.25
Nodes (7): 1. Install Dependencies, 2. Start the Databases, 3. Configure Environment Variables, 4. Start the Application Services, 5. Access the Platform, How to Run the Project, Prerequisites

### Community 93 - "Project Memory & Docs"
Cohesion: 0.20
Nodes (9): AI Companion Behavior, Auth & Privacy, Business Rules, Circuit Breaker (LLM Fallback), Complaint Filing, Complaint Tracking, Knowledge Base / Content, Scheme Recommendation (+1 more)

### Community 96 - "Scheme Discovery & Catalog"
Cohesion: 0.40
Nodes (4): CatalogItem, ChatMessage, Complaint, User

### Community 97 - "AI Chat & RAG Pipeline"
Cohesion: 0.25
Nodes (8): Part 1 — Core Router, Part 2 — Intent Intelligence, Part 3 — Dynamic Discovery Engine, Part 4 — Resource Optimizer, Part 5 — Execution Engine, Part 6 — Validation & Recovery, Part 7 — Enterprise Routing Schema, Table of Contents

### Community 98 - "Complaint Management"
Cohesion: 0.25
Nodes (5): AppController, Controller, Get, Inject, InjectConnection

### Community 99 - "Community 99"
Cohesion: 0.19
Nodes (10): QUICK_LINKS, containerVariants, FOOTER_LINKS, itemVariants, NAV_DEFS, RECENT_CHATS, Sidebar, Badge() (+2 more)

### Community 103 - "Task Management API"
Cohesion: 0.12
Nodes (3): TaskRepository, UserRepository, UserService

### Community 104 - "Task Management API"
Cohesion: 0.33
Nodes (5): Bugs, Known Bugs, Recently Fixed Issues, Technical Risk Areas (From TRD), Temporary Workarounds

### Community 106 - "Task Management API"
Cohesion: 0.15
Nodes (10): prisma, TaskService, ApiResponse, JWTPayload, PaginatedResponse, Task, TaskFilters, TaskWithUser (+2 more)

### Community 107 - "Task Management API"
Cohesion: 0.29
Nodes (6): Main Features (v1 Must-Have), Overall Workflow, Problem, Project Overview, Purpose, User Personas

### Community 108 - "Task Management API"
Cohesion: 0.29
Nodes (6): description, engines, node, main, name, version

### Community 109 - "Authentication & Security"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 110 - "Task Management API"
Cohesion: 0.40
Nodes (4): 2026-07-07 (Hackathon Optimization), 2026-07-07 (Initial), 2026-07-07 (TRD v1.0), Changelog

### Community 111 - "Task Management API"
Cohesion: 0.33
Nodes (5): content, darkMatch, fs, newContent, rootMatch

### Community 113 - "Task Management API"
Cohesion: 0.40
Nodes (4): 1. AI Slop & Cliché Assessment, 2. Heuristic UX Review, 3. Action Plan (for `quieter`, `layout`, `typeset`), Impeccable Critique: `apps/web/app/[locale]/page.tsx`

### Community 114 - "Task Management API"
Cohesion: 0.40
Nodes (4): code, fs, path, targetFile

### Community 116 - "Task Management API"
Cohesion: 0.15
Nodes (16): validate(), changePasswordSchema, CreateTaskInput, createTaskSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema (+8 more)

### Community 117 - "Task Management API"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 118 - "Task Management API"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 120 - "Task Management API"
Cohesion: 0.50
Nodes (3): File Index, Maintenance Rules, Smart Bharat — Project Memory

### Community 121 - "Task Management API"
Cohesion: 0.50
Nodes (3): content, fs, removals

### Community 123 - "5.8 Execution Checkpoints"
Cohesion: 0.40
Nodes (3): ComplaintItem, ComplaintsResponse, ComplaintsTabProps

### Community 124 - "test-mongo.js"
Cohesion: 0.67
Nodes (3): client, { MongoClient }, run()

### Community 125 - "SchemeMatchDto"
Cohesion: 0.70
Nodes (3): AiTask, runAiTask(), getMockResponse()

### Community 156 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, intlMiddleware, middleware()

### Community 160 - "2.5 Complexity Scoring Engine"
Cohesion: 0.40
Nodes (5): 2.5 Complexity Scoring Engine, Complexity Scoring Examples, Scoring Matrix, Tier Definitions, Tier Resource Budgets

### Community 207 - "fix.js"
Cohesion: 0.50
Nodes (3): css, fs, tw

### Community 208 - "2.1 Intent Parsing"
Cohesion: 0.50
Nodes (4): 2.1 Intent Parsing, Intent Object Schema, Request Type Classification, The Five Dimensions of Intent

### Community 209 - "2.3 Multi-turn Awareness"
Cohesion: 0.50
Nodes (4): 2.3 Multi-turn Awareness, Multi-turn Routing Rules, Multi-turn State Tracking, What Multi-turn History Provides

### Community 210 - "2.4 Domain Classification"
Cohesion: 0.50
Nodes (4): 2.4 Domain Classification, Domain Tagging Rules, Domain Taxonomy, Domain-to-Skill Affinity Map

## Knowledge Gaps
- **880 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+875 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **91 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `Admin CMS` to `Task Management API`, `Frontend UI Components`, `Authentication & Security`, `Task Management API`, `AI Chat & RAG Pipeline`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `types` connect `Admin CMS` to `Scheme Discovery & Catalog`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Scheme Discovery & Catalog` to `Admin CMS`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _880 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Complaint Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Task Management API` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Should `Admin CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.07053140096618357 - nodes in this community are weakly interconnected._