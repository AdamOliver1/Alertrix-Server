import { Alert, AlertDto } from '../../../types/alert';

export interface IAlertRepository {
  create(data: AlertDto): Promise<Alert>;
  findAll(): Promise<Alert[]>;
  findById(id: string): Promise<Alert | null>;
  update(id: string, data: Partial<AlertDto>): Promise<Alert | null>;
  delete(id: string): Promise<boolean>;
  updateAlertStatus(id: string, isTriggered: boolean): Promise<Alert | null>;
} 