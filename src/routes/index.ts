import { Router } from 'express';
import weatherRouter from './weather.routes';
import alertRouter from './alert.routes';

const router = Router();

// Register all routes
router.use('/weather', weatherRouter);
router.use('/alerts', alertRouter);

export default router; 