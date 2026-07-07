import express from 'express';
import usersRoutes from './users.js';
import authRoutes from './auth.js';
import dropsRoutes from './drops.js';

const router = express.Router();

router.use(usersRoutes);
router.use(authRoutes);
router.use(dropsRoutes);

export default router;
