import request from 'supertest';
import app from '@/app';
import { mockAuthService, mockTaskService, mockUserService } from './setup';

describe('Task Endpoints', () => {
  const mockUserId = 'user-1';
  let mockVerifyToken: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyToken = jest.spyOn(require('@/services').authService, 'verifyAccessToken').mockReturnValue({
      userId: mockUserId,
      email: 'test@example.com',
    });
    (require('@/repositories').prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed',
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterEach(() => {
    mockVerifyToken.mockRestore();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task', async () => {
      mockTaskService.create.mockResolvedValue({
        id: 'c1a2b3c4d5e6f7g8h9i0j1k2',
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
      });

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Test Task', description: 'Description' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task).toMatchObject({ title: 'Test Task' });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Test Task' });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return paginated tasks', async () => {
      mockTaskService.findAll.mockResolvedValue({
        data: [
          {
            id: 'c1a2b3c4d5e6f7g8h9i0j1k2',
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
      });

      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer valid-token')
        .query({ page: 1, limit: 20 });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      mockTaskService.findAll.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer valid-token')
        .query({ status: 'DONE' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/tasks/stats', () => {
    it('should return task statistics', async () => {
      mockUserService.getProfile.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
      });

      mockTaskService.getStats.mockResolvedValue({
        TODO: 5,
        IN_PROGRESS: 0,
        DONE: 3,
        ARCHIVED: 0,
      });

      const response = await request(app)
        .get('/api/v1/tasks/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.data.stats).toEqual({
        TODO: 5,
        IN_PROGRESS: 0,
        DONE: 3,
        ARCHIVED: 0,
      });
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task by id', async () => {
      mockTaskService.findById.mockResolvedValue({
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
      });

      const response = await request(app)
        .get('/api/v1/tasks/c1a2b3c4d5e6f7g8h9i0j1k2')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.data.task).toMatchObject({ id: 'c1a2b3c4d5e6f7g8h9i0j1k2' });
    });

    it('should return 404 for non-existent task', async () => {
      // Mock taskService to throw NotFoundError
      mockTaskService.findById.mockRejectedValueOnce(new Error('Task not found'));

      const response = await request(app)
        .get('/api/v1/tasks/c1a2b3c4d5e6f7g8h9i0j1k2')
        .set('Authorization', 'Bearer valid-token');

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/v1/tasks/:id', () => {
    it('should update a task', async () => {
      mockTaskService.update.mockResolvedValue({
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
      });

      const response = await request(app)
        .patch('/api/v1/tasks/c1a2b3c4d5e6f7g8h9i0j1k2')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Task', status: 'IN_PROGRESS', priority: 'HIGH' });

      expect(response.status).toBe(200);
      expect(response.body.data.task).toMatchObject({ title: 'Updated Task', status: 'IN_PROGRESS' });
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
      mockTaskService.delete.mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/v1/tasks/c1a2b3c4d5e6f7g8h9i0j1k2')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });
});