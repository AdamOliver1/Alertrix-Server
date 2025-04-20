import { injectable, inject } from 'tsyringe';
import { Handler } from '../NotificationHandler';
import { AlertNotificationData } from '../notifications/AlertNotificationHandler';
import { IEmailService } from '../../services/interfaces/email.service.interface';
import { Tokens } from '../../app-registry/tokens';
import { IMessageCreator } from '../../services/interfaces/message-creator.interface';
import { logger } from '../../utils/logger';
import { AppError } from '../../ErrorHandling/AppError';
import { IEmailNotificationHandler } from './interfaces/notification-handler.interface';

/**
 * Email handler for alert notifications
 * Sends alert notifications via email
 */
@injectable()
export class EmailHandler implements Handler<AlertNotificationData>, IEmailNotificationHandler {
  constructor(
    @inject(Tokens.EmailService) private emailService: IEmailService,
    @inject(Tokens.MessageCreator) private messageCreator: IMessageCreator
  ) {}

  async handle(data: AlertNotificationData): Promise<void> {
    try {
      // Use the message creator to generate personalized email content
      const { subject, body } = await this.messageCreator.createMessage(data);

      // Send email to each recipient in the emails array
      await Promise.all(
        data.alert.emails.map(email => 
          this.emailService.sendEmail({
            subject,
            body,
            to: email
          }).catch(error => {
            // Log individual email failures at error level
            logger.error(`Failed to send email to ${email}`, {
              error,
              alertId: data.alert.id,
              emailAddress: email
            });
            // We don't throw here to allow other emails to be sent
          })
        )
      );
    } catch (error) {
      logger.error('Failed to process alert notification', {
        error,
        alertId: data.alert.id,
        alertName: data.alert.name
      });
      
      const appError = new AppError(
        `Failed to process alert notification for ${data.alert.name}: ${(error as Error).message}`,
        500,
        'Failed to send alert notifications. The system will retry automatically.'
      );
      appError.isOperational = false;
      throw appError;
    }
  }
} 