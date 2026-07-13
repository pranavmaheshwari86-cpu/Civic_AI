import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UserRepository, TaskRepository } from '@/repositories';
import app from '@/app';
import { authService } from '@/services';

export const prisma = mockDeep<PrismaClient>();

// Mock the services with all needed methods
export const mockAuthService = {
  register: jest.fn().mockResolvedValue({
    user: {
      id: 'user-1',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      isActive: true,
      createdAt: new Date(),
    },
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    },
  }),
  login: jest.fn().mockResolvedValue({
    user: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      createdAt: new Date(),
    },
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    },
  }),
  refresh: jest.fn().mockResolvedValue({ accessToken: 'new-access-token' }),
  verifyAccessToken: jest.fn().mockReturnValue({ userId: 'user-1', email: 'test@example.com' }),
};

export const mockUserService = {
  getProfile: jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    createdAt: new Date(),
  }),
  updateProfile: jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    createdAt: new Date(),
  }),
  deactivate: jest.fn().mockResolvedValue(undefined),
};

export const mockTaskService = {
  create: jest.fn().mockResolvedValue({
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  }),
  findAll: jest.fn().mockResolvedValue({
    data: [
      {
        id: 'task-1',
        title: 'Task 1',
        status: 'TODO',
        priority: 'MEDIUM',
        userId: 'user-1',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      },
    ],
    meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
  }),
  findById: jest.fn().mockResolvedValue({
    id: 'c1a2b3c4d5e6f7g8h9i0j1k2',
    title: 'Test Task',
    status: 'TODO',
    priority: 'MEDIUM',
    userId: 'user-1',
    user: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  }),
  update: jest.fn().mockResolvedValue({
    id: 'c1a2b3c4d5e6f7g8h9i0j1k2',
    title: 'Updated Task',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    userId: 'user-1',
    user: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  }),
  delete: jest.fn().mockResolvedValue(undefined),
  getStats: jest.fn().mockResolvedValue({
    TODO: 5,
    IN_PROGRESS: 0,
    DONE: 3,
    ARCHIVED: 0,
  }),
};

// Mock the services module
jest.mock('@/services', () => ({
  authService: mockAuthService,
  userService: mockUserService,
  taskService: mockTaskService,
  __esModule: true,
}));

// Mock the repositories
jest.mock('@/repositories', () => ({
  prisma: mockDeep<PrismaClient>(),
  UserRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
  TaskRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findById: jest.fn(),
    findByIdWithUser: jest.fn(),
    findManyByUser: jest.fn(),
    update: jest.fn(),
    updateWithUser: jest.fn(),
    delete: jest.fn(),
    countByUser: jest.fn(),
  })),
  __esModule: true,
}));

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockToken = 'Bearer valid-token';

beforeEach(() => {
  jest.clearAllMocks();
});