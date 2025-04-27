import { Alert, AlertStatus, AlertDto } from '../../types/alert';

export interface IAlertService {
  createAlert(data: AlertDto): Promise<Alert>;
  getAlertById(id: string): Promise<Alert | null>;
  updateAlert(id: string, data: Partial<AlertDto>): Promise<Alert | null>;
  deleteAlert(id: string): Promise<boolean>;
  getAlertStatuses(): Promise<AlertStatus[]>;
  getAllAlerts(): Promise<Alert[]>;
  evaluateAllAlerts(): Promise<{ alertsTriggered: boolean }>;
  restartAlert(id: string): Promise<Alert | null>;
} 