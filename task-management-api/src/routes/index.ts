import { Router } from 'express';
import { authController, taskController } from '@/controllers';
import { authenticate } from '@/middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  changePasswordSchema,
  updateProfileSchema,
} from '@/validators/schemas';
import { validate } from '@/middleware/validation';
import { authLimiter } from '@/middleware/rateLimit';

const router = Router();

router.post('/auth/register', authLimiter, validate(registerSchema), authController.register);
router.post('/auth/login', authLimiter, validate(loginSchema), authController.login);
router.post('/auth/refresh', validate(refreshTokenSchema), authController.refresh);

router.use(authenticate);

router.patch('/auth/password', validate(changePasswordSchema), authController.changePassword);
router.get('/auth/me', authController.me);
router.patch('/auth/profile', validate(updateProfileSchema), authController.updateProfile);
router.delete('/auth/me', authController.deactivate);

router.get('/tasks', validate(taskQuerySchema), taskController.getAll);
router.get('/tasks/stats', taskController.getStats);
router.post('/tasks', validate(createTaskSchema), taskController.create);
router.get('/tasks/:id', validate(taskParamsSchema), taskController.getById);
router.patch('/tasks/:id', validate(updateTaskSchema), taskController.update);
router.delete('/tasks/:id', validate(taskParamsSchema), taskController.delete);

export default router;