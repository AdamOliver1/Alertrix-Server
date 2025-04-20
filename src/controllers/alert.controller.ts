import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAlertService } from '../services/interfaces/alert.service.interface';
import { createAlertSchema } from '../validations/alert.schema';
import { Tokens } from '../app-registry/tokens';
import { 
  handleValidationError, 
  handleResourceNotFound 
} from '../ErrorHandling/errorHandlers';

@injectable()
export class AlertController {
  constructor(@inject(Tokens.AlertService) private alertService: IAlertService) {}

  createAlert = async (req: Request, res: Response): Promise<void> => {
    // Validate request body
    const bodyResult = createAlertSchema.safeParse(req.body);
    if (!bodyResult.success) {
      throw handleValidationError(bodyResult, 'Invalid alert data');
    }
    
    const alert = await this.alertService.createAlert(bodyResult.data);
    res.status(201).json(alert);
  };

  getAlertById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const alert = await this.alertService.getAlertById(id);
    
    if (!alert) {
      throw handleResourceNotFound('Alert', id);
    }
    
    res.json(alert);
  };

  updateAlert = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    // Partial validation
    const bodyResult = createAlertSchema.partial().safeParse(req.body);
    
    if (!bodyResult.success) {
      throw handleValidationError(bodyResult, 'Invalid alert data');
    }
    
    const alert = await this.alertService.updateAlert(id, bodyResult.data);
    
    if (!alert) {
      throw handleResourceNotFound('Alert', id);
    }
    
    res.json(alert);
  };

  deleteAlert = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const success = await this.alertService.deleteAlert(id);
    
    if (!success) {
      throw handleResourceNotFound('Alert', id);
    }
    
    res.status(204).end();
  };

  getAlertStatuses = async (_req: Request, res: Response): Promise<void> => {
    const statuses = await this.alertService.getAlertStatuses();
    res.json(statuses);
  };

  // Method for testing alert evaluation
  evaluateAlertsNow = async (_req: Request, res: Response): Promise<void> => {
    await this.alertService.evaluateAllAlerts();
    res.json({ message: 'Alerts evaluation triggered successfully' });
  };
  
  restartAlert = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const alert = await this.alertService.restartAlert(id);
    
    if (!alert) {
      throw handleResourceNotFound('Alert', id);
    }
    
    res.json(alert);
  };
} 