import { AlertNotificationData } from '../../notifications/notifications/AlertNotificationHandler';

/**
 * Interface for message creation services
 * Abstracts the message creation logic to allow for different implementations
 */
export interface IMessageCreator {
  /**
   * Creates a personalized message for email notifications
   * @param data Alert notification data
   * @returns Promise containing the subject and body of the message
   */
  createMessage(data: AlertNotificationData): Promise<{
    subject: string;
    body: string;
  }>;
} 