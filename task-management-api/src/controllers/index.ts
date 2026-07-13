import type { Request, Response } from 'express';
import { authService, userService, taskService } from '@/services';
import { asyncHandler } from '@/middleware/error';
import { logger } from '@/utils/logger';
import type { TaskStatus, TaskPriority } from '@prisma/client';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    logger.info('User registered', { userId: user.id });
    res.status(201).json({ status: 'success', data: { user, tokens } });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body.email, req.body.password);
    logger.info('User logged in', { userId: user.id });
    res.json({ status: 'success', data: { user, tokens } });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { accessToken } = await authService.refresh(req.body.refreshToken);
    res.json({ status: 'success', data: { accessToken } });
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
    logger.info('Password changed', { userId: req.user!.userId });
    res.json({ status: 'success', message: 'Password changed successfully' });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.userId);
    res.json({ status: 'success', data: { user } });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    res.json({ status: 'success', data: { user } });
  }),

  deactivate: asyncHandler(async (req: Request, res: Response) => {
    await userService.deactivate(req.user!.userId);
    res.json({ status: 'success', message: 'Account deactivated' });
  }),
};

export const taskController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.create(req.user!.userId, req.body);
    logger.info('Task created', { taskId: task.id, userId: req.user!.userId });
    res.status(201).json({ status: 'success', data: { task } });
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      status: req.query.status as TaskStatus,
      priority: req.query.priority as TaskPriority,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };
    const result = await taskService.findAll(req.user!.userId, filters);
    res.json({ status: 'success', data: result.data, pagination: result.meta });
  }),

  getStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await taskService.getStats(req.user!.userId);
    res.json({ status: 'success', data: { stats } });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.findById(req.user!.userId, req.params.id);
    res.json({ status: 'success', data: { task } });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.update(req.user!.userId, req.params.id, req.body);
    logger.info('Task updated', { taskId: task.id, userId: req.user!.userId });
    res.json({ status: 'success', data: { task } });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await taskService.delete(req.user!.userId, req.params.id);
    logger.info('Task deleted', { taskId: req.params.id, userId: req.user!.userId });
    res.status(204).send();
  }),
};