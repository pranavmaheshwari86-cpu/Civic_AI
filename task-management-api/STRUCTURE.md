src/
├── app.ts              # Express app setup
├── index.ts            # Entry point
├── config/             # Configuration
├── controllers/        # Route handlers
│   ├── authController.ts
│   └── taskController.ts
├── docs/               # Swagger documentation
│   └── swagger.ts
├── middleware/         # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── requestLogger.ts
├── routes/             # Route definitions
│   ├── authRoutes.ts
│   └── taskRoutes.ts
├── services/           # Business logic
│   ├── auth.ts
│   ├── cache.ts
│   ├── database.ts
│   └── task.ts
├── utils/              # Utilities
│   ├── errors.ts
│   └── logger.ts
├── validators/         # Zod validation schemas
│   └── index.ts
└── types/              # TypeScript types
    └── index.ts