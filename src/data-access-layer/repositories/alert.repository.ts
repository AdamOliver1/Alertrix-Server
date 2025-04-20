import { injectable } from 'tsyringe';
import { Alert, AlertDto } from '../../types/alert';
import { AlertModel, AlertDocument } from '../models/alert.model';
import { IAlertRepository } from './interfaces/alert.repository.interface';

@injectable()
export class AlertRepository implements IAlertRepository {
  async create(data: AlertDto): Promise<Alert> {
    const newAlert = new AlertModel(data);
    const saved = await newAlert.save();
    return this.documentToAlert(saved);
  }

  async findAll(): Promise<Alert[]> {
    const alerts = await AlertModel.find().sort({ createdAt: -1 });
    return alerts.map(alert => this.documentToAlert(alert));
  }

  async findById(id: string): Promise<Alert | null> {
    const alert = await AlertModel.findById(id);
    return alert ? this.documentToAlert(alert) : null;
  }

  async update(id: string, data: Partial<AlertDto>): Promise<Alert | null> {
    const updated = await AlertModel.findByIdAndUpdate(id, data, { new: true });
    return updated ? this.documentToAlert(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await AlertModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateAlertStatus(id: string, isTriggered: boolean): Promise<Alert | null> {
    const updated = await AlertModel.findByIdAndUpdate(
      id, 
      { 
        isTriggered
      }, 
      { new: true }
    );
    return updated ? this.documentToAlert(updated) : null;
  }

  private documentToAlert(doc: AlertDocument): Alert {
    return doc.toJSON() as Alert;
  }
} 