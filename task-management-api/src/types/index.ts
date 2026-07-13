import type { TaskStatus, TaskPriority } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskWithUser = Task & { user: User };

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ApiResponse<T = unknown> = {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: ValidationError[];
};

export type ValidationError = {
  field: string;
  message: string;
};

export type JWTPayload = {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
};

export type TaskFilters = {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};