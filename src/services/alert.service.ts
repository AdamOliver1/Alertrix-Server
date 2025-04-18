import { injectable, inject } from 'tsyringe';
import { Alert, AlertStatus, AlertDto  } from '../types/alert';
import { AlertDataLayer } from '../data-access-layer/repositories/interfaces/AlertDataLayer';
import { IWeatherService } from './interfaces/weather-service.interface';
import { IAlertService } from './interfaces/alert.service.interface';
import { ThresholdCondition } from '../types/weather';
import { AlertNotificationHandler } from '../notifications/notifications/AlertNotificationHandler';
import { Tokens } from '../app-registry/tokens';
import { logger } from '../utils/logger';
import { AppError } from '../ErrorHandling/AppError';

@injectable()
export class AlertService implements IAlertService {
  constructor(
    @inject(Tokens.AlertRepository) private alertRepository: AlertDataLayer,
    @inject(Tokens.WeatherService) private weatherService: IWeatherService,
    @inject(Tokens.AlertNotificationService) private alertNotificationService: AlertNotificationHandler
  ) {}

  async createAlert(data: AlertDto): Promise<Alert> {
    // Validate email count before creating
    if (data.emails.length > 5) {
      throw new AppError('Email limit exceeded', 400, 'Maximum of 5 email addresses allowed');
    }
    return this.alertRepository.create(data);
  }

  async getAlertById(id: string): Promise<Alert | null> {
    return this.alertRepository.findById(id);
  }

  async updateAlert(id: string, data: Partial<AlertDto>): Promise<Alert | null> {
    // Validate email count if emails are being updated
    if (data.emails && data.emails.length > 5) {
      throw new AppError('Email limit exceeded', 400, 'Maximum of 5 email addresses allowed');
    }
    return this.alertRepository.update(id, data);
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alertRepository.delete(id);
  }

  async getAlertStatuses(): Promise<AlertStatus[]> {
    const alerts = await this.alertRepository.findAll();
    return alerts.map(alert => ({
      id: alert.id,
      name: alert.name,
      emails: alert.emails,
      isTriggered: alert.isTriggered,
      condition: alert.condition,
      location: alert.location,
    }));
  }

  async evaluateAllAlerts(): Promise<void> {
    const alerts = await this.alertRepository.findAll();

    await Promise.all(
      alerts.map(async (alert) => {
        try {
          const weather = await this.weatherService.getCurrentWeather(alert.location);
          const isTriggered = this.evaluateCondition(alert.condition, weather);
          
          
          // If alert is newly triggered, send notification
          if (!alert.isTriggered && isTriggered) {
            await this.alertRepository.updateAlertStatus(alert.id, isTriggered);
            
            // Only send notifications if there are email recipients
            if (alert.emails && alert.emails.length > 0) {
              const severity = this.determineSeverity(alert.condition, weather);
              
              // Send notification asynchronously using the new method
              this.alertNotificationService.notifyAsync({
                alert,
                weather,
                timestamp: new Date(),
                severity
              });
            } else {
              logger.info(`Alert ${alert.id} - ${alert.name} triggered but no email recipients configured`);
            }
          }
        } catch (error) {
          logger.error(`Failed to evaluate alert ${alert.id} - ${alert.name}`, {
            error,
            alertId: alert.id
          });
        }
      })
    );
  }

  async restartAlert(id: string): Promise<Alert | null> {
    return this.alertRepository.updateAlertStatus(id, false);
  }

  private evaluateCondition(condition: ThresholdCondition, weatherData: any): boolean {
    const { parameter, operator, value } = condition;
    const currentValue = weatherData[parameter];

    if (currentValue === undefined) {
      return false;
    }

    switch (operator) {
      case '>':
        return currentValue > value;
      case '<':
        return currentValue < value;
      case '>=':
        return currentValue >= value;
      case '<=':
        return currentValue <= value;
      case '=':
        return currentValue === value;
      case '!=':
        return currentValue !== value;
      default:
        return false;
    }
  }

  private determineSeverity(condition: ThresholdCondition, weather: any): 'info' | 'warning' | 'error' | 'critical' {
    const { parameter, operator, value } = condition;
    const currentValue = weather[parameter];
    const difference = Math.abs(currentValue - value);
    const percentageDifference = (difference / value) * 100;

    if (percentageDifference > 50) return 'critical';
    if (percentageDifference > 25) return 'error';
    if (percentageDifference > 10) return 'warning';
    return 'info';
  }
} 