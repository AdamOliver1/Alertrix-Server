import { AlertNotificationData } from '../../notifications/AlertNotificationHandler';

/**
 * Interface for email notification handlers
 * Defines the contract for classes that handle email notifications
 */
export interface IEmailNotificationHandler {
  /**
   * Handles an alert notification by sending emails
   * @param data The alert notification data
   */
  handle(data: AlertNotificationData): Promise<void>;
}

