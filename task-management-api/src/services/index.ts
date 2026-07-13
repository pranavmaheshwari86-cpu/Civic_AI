import bcrypt from 'bcryptjs';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { UserRepository, TaskRepository, prisma } from '@/repositories';
import { AppError, UnauthorizedError, NotFoundError, ConflictError } from '@/utils/errors';
import type { TaskFilters, PaginatedResponse, TaskWithUser } from '@/types';

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_ACCESS_EXPIRY: SignOptions['expiresIn'] = (process.env.JWT_ACCESS_EXPIRY as SignOptions['expiresIn']) || '15m';
const JWT_REFRESH_EXPIRY: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_EXPIRY as SignOptions['expiresIn']) || '7d';

const userRepository = new UserRepository();
const taskRepository = new TaskRepository();

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.userRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    const userWithoutPassword = { ...user };
    // @ts-expect-error - delete property from spread object
    delete userWithoutPassword.passwordHash;
    return { user: userWithoutPassword, tokens };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    const userWithoutPassword = { ...user };
    // @ts-expect-error - delete property from spread object
    delete userWithoutPassword.passwordHash;
    return { user: userWithoutPassword, tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      const accessToken = this.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, { passwordHash });
  }

  private generateTokens(payload: { userId: string; email: string }) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string; email: string }): string {
    return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRY,
    } as SignOptions);
  }

  private generateRefreshToken(payload: { userId: string; email: string }): string {
    return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRY,
    } as SignOptions);
  }

  verifyAccessToken(token: string): { userId: string; email: string } {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; type: string };
    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }
    return { userId: payload.userId, email: payload.email };
  }

  private verifyRefreshToken(token: string): { userId: string } {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }
    return { userId: payload.userId };
  }
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const userWithoutPassword = { ...user };
    // @ts-expect-error - delete property from spread object
    delete userWithoutPassword.passwordHash;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await this.userRepository.update(userId, data);
    if (!user) throw new NotFoundError('User not found');
    const userWithoutPassword = { ...user };
    // @ts-expect-error - delete property from spread object
    delete userWithoutPassword.passwordHash;
    return userWithoutPassword;
  }

  async deactivate(userId: string) {
    await this.userRepository.update(userId, { isActive: false });
  }
}

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async create(userId: string, data: {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
  }): Promise<TaskWithUser> {
    const task = await this.taskRepository.create({
      ...data,
      userId,
      status: data.status ?? TaskStatus.TODO,
      priority: data.priority ?? TaskPriority.MEDIUM,
    });
    return this.taskRepository.findByIdWithUser(task.id) as Promise<TaskWithUser>;
  }

  async findAll(userId: string, filters: TaskFilters): Promise<PaginatedResponse<TaskWithUser>> {
    return this.taskRepository.findManyByUser(userId, {
      status: filters.status,
      priority: filters.priority,
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      sortBy: filters.sortBy ?? 'createdAt',
      sortOrder: filters.sortOrder ?? 'desc',
      search: filters.search,
    });
  }

  async findById(userId: string, taskId: string): Promise<TaskWithUser> {
    const task = await this.taskRepository.findByIdWithUser(taskId);
    if (!task) throw new NotFoundError('Task not found');
    if (task.userId !== userId) throw new UnauthorizedError('Access denied');
    return task;
  }

  async update(userId: string, taskId: string, data: Partial<{
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
  }>): Promise<TaskWithUser> {
    await this.findById(userId, taskId);
    const updated = await this.taskRepository.updateWithUser(taskId, data);
    if (!updated) throw new NotFoundError('Task not found');
    return updated;
  }

  async delete(userId: string, taskId: string): Promise<void> {
    await this.findById(userId, taskId);
    await this.taskRepository.delete(taskId);
  }

  async getStats(userId: string): Promise<Record<TaskStatus, number>> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      select: { status: true },
    });

    const stats: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      ARCHIVED: 0,
    };

    tasks.forEach(t => stats[t.status]++);
    return stats;
  }
}

export const authService = new AuthService(userRepository);
export const userService = new UserService(userRepository);
export const taskService = new TaskService(taskRepository);