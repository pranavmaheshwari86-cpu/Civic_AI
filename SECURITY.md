# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in CivicAI, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: [security@smartbharat.dev](mailto:security@smartbharat.dev)
3. Include a detailed description of the vulnerability
4. We will acknowledge receipt within 48 hours

## Security Measures Implemented

### Authentication & Authorization
- **OTP-based authentication** via MSG91 with bcrypt-hashed OTP storage
- **JWT tokens** with short-lived access tokens (15 min) and refresh tokens
- **Separate admin auth** with dedicated `ADMIN_JWT_SECRET` and role-based guards
- **Rate limiting** (ThrottlerGuard: 10 requests/minute) on all endpoints

### Data Protection
- **No PII storage** beyond phone numbers (required for OTP)
- **No Aadhaar/PAN** collection — AI is explicitly instructed to never request sensitive IDs
- **DPDP Act compliance** considered in design decisions
- **Environment-based secrets** — no hardcoded credentials anywhere in codebase

### Infrastructure Security
- **Helmet.js** security headers (CSP, X-Frame-Options, HSTS, etc.)
- **CORS restriction** to configured `FRONTEND_URL` only
- **Input validation** via class-validator DTOs with whitelist mode
- **File upload validation** — content-type restricted to `image/jpeg`, `image/png`, `image/webp`
- **Presigned URLs** for photo uploads (server never handles raw file bytes)

### AI Safety
- **Circuit breaker** prevents cascading failures from AI service outages
- **Multi-provider fallback** (Gemini → Claude → Mock) ensures availability
- **System prompt boundaries** — AI instructed to never fabricate government facts
- **No prompt injection surface** — user inputs are isolated from system instructions

### Monitoring
- **Sentry** error tracking on both frontend and backend
- **Health check endpoint** (`/api/v1/healthz`) with MongoDB and Redis connectivity verification
