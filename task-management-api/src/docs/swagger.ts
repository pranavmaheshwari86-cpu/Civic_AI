import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@/config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A production-ready REST API for task management with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            userId: { type: 'string', format: 'cuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        TaskCreate: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED'], default: 'TODO' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        TaskUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 2000, nullable: true },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        PaginatedTasks: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        TaskStats: {
          type: 'object',
          properties: {
            TODO: { type: 'integer' },
            IN_PROGRESS: { type: 'integer' },
            DONE: { type: 'integer' },
            ARCHIVED: { type: 'integer' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            tokens: { $ref: '#/components/schemas/AuthTokens' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'firstName', 'lastName'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    firstName: { type: 'string', minLength: 1, maxLength: 50 },
                    lastName: { type: 'string', minLength: 1, maxLength: 50 },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '409': { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '429': { description: 'Too many requests' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '429': { description: 'Too many requests' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Token refreshed', content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' } } } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Invalid refresh token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks with pagination and filters',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED'] } },
            { name: 'priority', in: 'query', schema: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'], default: 'createdAt' } },
            { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          ],
          responses: {
            '200': { description: 'Tasks retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedTasks' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskCreate' } } },
          },
          responses: {
            '201': { description: 'Task created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/tasks/stats': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Stats retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskStats' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } }],
          responses: {
            '200': { description: 'Task retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update task',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskUpdate' } } } },
          responses: {
            '200': { description: 'Task updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } }],
          responses: {
            '204': { description: 'Task deleted' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);