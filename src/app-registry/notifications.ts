import { container } from 'tsyringe';
import { NotificationHandler } from '../notifications/NotificationHandler';
import { AlertNotificationHandler } from '../notifications/notifications/AlertNotificationHandler';
import { EmailService } from '../services/email.service';
import { EmailHandler } from '../notifications/handlers/EmailHandler';
import { Tokens } from './tokens';

/**
 * Sets up and registers all notification-related services in the container
 */
export function setupNotifications() {

  // Create and configure alert notification service
  const alertNotificationService = new AlertNotificationHandler()
    .registerHandler(container.resolve(EmailHandler));

  // Register the alert notification service
  container.register(Tokens.AlertNotificationService, { useValue: alertNotificationService });
} 