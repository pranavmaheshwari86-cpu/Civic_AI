import type { User, Task, TaskStatus, TaskPriority } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { PaginatedResponse, TaskWithUser } from '@/types';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export class UserRepository {
  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.user.delete({ where: { id } });
    return !!result;
  }
}

export class TaskRepository {
  async create(data: {
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date | null;
    userId: string;
  }): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async findByIdWithUser(id: string): Promise<TaskWithUser | null> {
    return prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findManyByUser(
    userId: string,
    filters: {
      status?: TaskStatus;
      priority?: TaskPriority;
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
      search?: string;
    }
  ): Promise<PaginatedResponse<TaskWithUser>> {
    const { status, priority, page, limit, sortBy, sortOrder, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { user: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    return prisma.task.update({ where: { id }, data });
  }

  async updateWithUser(id: string, data: Partial<Task>): Promise<TaskWithUser | null> {
    return prisma.task.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.task.delete({ where: { id } });
    return !!result;
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.task.count({ where: { userId } });
  }
}

export { prisma };