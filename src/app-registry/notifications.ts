import { container } from 'tsyringe';
import { NotificationHandler } from '../notifications/NotificationHandler';
import { AlertNotificationHandler } from '../notifications/notifications/AlertNotificationHandler';
import { EmailHandler } from '../notifications/handlers/EmailHandler';
import { IEmailNotificationHandler } from '../notifications/handlers/interfaces/notification-handler.interface';
import { Tokens } from './tokens';

/**
 * Sets up and registers all notification-related services in the container
 */
export function setupNotifications() {
  // Get the email handler from the container
  const emailHandler = container.resolve<IEmailNotificationHandler>(Tokens.EmailNotificationHandler);

  // Create and configure alert notification service
  const alertNotificationService = new AlertNotificationHandler()
    .registerHandler(emailHandler);

  // Register the alert notification service
  container.register(Tokens.AlertNotificationService, { useValue: alertNotificationService });
} 