import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { AppError } from '../ErrorHandling/AppError';
import { config } from '../config';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromAddress: string;

  constructor() {
    // Get the from address from config
    this.fromAddress = config.email.fromAddress;
    
    // Create transporter with Gmail SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'service' instead of host/port for Gmail
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
    });
    
    // Verify connection configuration
    this.verifyConnection();
  }
  
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {
      logger.error('Email service connection verification failed', { error });
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        text: options.body,
        html: `<p>${options.body.replace(/\n/g, '<br>')}</p>`,
      });
    } catch (error) {
      logger.error('Failed to send email', { 
        error,
        recipient: options.to,
        subject: options.subject
      });
      
      // Throw an AppError with isOperational = false to ensure it's logged as an error
      const appError = new AppError(
        `Failed to send email to ${options.to}: ${(error as Error).message}`,
        500,
        'Unable to send notification email. Please try again later.'
      );
      // Setting isOperational to false ensures it's logged as an error, not just a warning
      appError.isOperational = false;
      throw appError;
    }
  }
} 