import { injectable } from 'tsyringe';
import { NotificationHandler, Handler, Notifier } from '../NotificationHandler';
import { Alert } from '../../types/alert';
import { WeatherData } from '../../types/weather';

/**
 * Data structure for alert notifications
 * Contains both alert and weather data for context
 */
export interface AlertNotificationData {
  alert: Alert;
  weather: WeatherData;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}
/**
 * Service specifically for handling alert notifications
 * Extends the base NotificationService with alert-specific functionality
 */
@injectable()
export class AlertNotificationHandler extends NotificationHandler<AlertNotificationData> {
 
} 