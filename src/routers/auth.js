import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/userSchema.js';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/auth/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/auth/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/auth/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/auth/logout', ctrlWrapper(logoutUserController));

export default router;
