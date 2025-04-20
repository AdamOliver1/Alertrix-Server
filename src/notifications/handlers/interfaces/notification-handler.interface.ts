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

/**
 * Generic interface for notification handlers
 * Can be extended for different notification types
 */
export interface INotificationHandler<T> {
  /**
   * Handles a notification of type T
   * @param data The notification data
   */
  handle(data: T): Promise<void>;
} 