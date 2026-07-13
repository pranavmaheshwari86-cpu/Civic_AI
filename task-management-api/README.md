# Task Management API

A production-ready RESTful API for task management built with Node.js, Express, TypeScript, PostgreSQL, and Redis.

## Features

- **Authentication**: JWT-based auth with access/refresh tokens
- **Task Management**: Full CRUD operations with filtering, pagination, and search
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for frequently accessed tasks
- **Documentation**: Auto-generated Swagger/OpenAPI docs
- **Testing**: Unit and integration tests with Jest
- **Containerization**: Multi-stage Docker builds
- **CI/CD**: GitHub Actions workflow

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache**: Redis 7+
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Documentation**: Swagger UI
- **Container**: Docker multi-stage builds

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-management-api

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Using Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user profile |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List tasks (paginated, filterable) |
| GET | `/api/v1/tasks/stats` | Get task statistics |
| POST | `/api/v1/tasks` | Create new task |
| GET | `/api/v1/tasks/:id` | Get single task |
| PATCH | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

### Query Parameters (GET /tasks)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `search` - Search in title/description
- `sortBy` - Sort field (createdAt, updatedAt, title, dueDate, priority)
- `sortOrder` - Sort direction (asc, desc)

## Environment Variables

See `.env.example` for all available options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for signing tokens (min 32 chars)
- `JWT_ACCESS_EXPIRY` - Access token expiry (default: 15m)
- `JWT_REFRESH_EXPIRY` - Refresh token expiry (default: 7d)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)

## Testing

```bash
# Run all tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run CI tests
npm run test:ci
```

## Documentation

Swagger UI available at: `http://localhost:3000/api-docs`

## Project Structure

```
src/
├── app.ts              # Express app setup
├── index.ts            # Entry point
├── config/             # Configuration
├── controllers/        # Route handlers
├── docs/               # Swagger documentation
├── middleware/         # Express middleware
├── routes/             # Route definitions
├── services/           # Business logic
├── utils/              # Utilities
├── validators/         # Zod validation schemas
└── types/              # TypeScript types
```

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- Password hashing with bcrypt (12 rounds)
- JWT with short-lived access tokens
- Refresh token rotation

## License

MIT