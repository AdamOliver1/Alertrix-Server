import { Router } from 'express';
import { container } from '../app-registry/container';
import { AlertController } from '../controllers/alert.controller';
import { asyncHandler } from '../utils/asyncHandler';

const alertRouter = Router();
const alertController = container.resolve(AlertController);

// POST /api/alerts - Create a new alert
alertRouter.post('/', asyncHandler(alertController.createAlert));

// GET /api/alerts - Get all alerts (new endpoint)
alertRouter.get('/', asyncHandler(alertController.getAllAlerts));

// GET /api/alerts/status - Get status of all alerts
alertRouter.get('/status', asyncHandler(alertController.getAlertStatuses));

// GET /api/alerts/:id - Get a specific alert
alertRouter.get('/:id', asyncHandler(alertController.getAlertById));

// POST /api/alerts/evaluate - Manually trigger alert evaluation (for testing)
alertRouter.post('/evaluate', asyncHandler(alertController.evaluateAlertsNow));

// PUT /api/alerts/:id - Update an alert
alertRouter.put('/:id', asyncHandler(alertController.updateAlert));

// DELETE /api/alerts/:id - Delete an alert
alertRouter.delete('/:id', asyncHandler(alertController.deleteAlert));

// POST /api/alerts/:id/restart - Restart an alert (set isTriggered to false)
alertRouter.post('/:id/restart', asyncHandler(alertController.restartAlert));

export default alertRouter; 