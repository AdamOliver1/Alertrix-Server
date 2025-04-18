import { injectable, inject } from 'tsyringe';
import { IMessageCreator } from '../interfaces/message-creator.interface';
import { AlertNotificationData } from '../../notifications/notifications/AlertNotificationHandler';
import { EmailResponse, MessagePromptBuilder } from './message-prompt-builder';
import { OpenAIClient } from '../../api';
import { Tokens } from '../../app-registry/tokens';
import { logger } from '../../utils/logger';

@injectable()
export class GPTMessageCreator implements IMessageCreator {
  constructor(
    @inject(Tokens.OpenAIClient) private openaiClient: OpenAIClient
  ) {}

  /**
   * Creates an email message for an alert notification using OpenAI
   * @param data The alert notification data
   * @returns An object containing the email subject and body
   */
  async createMessage(data: AlertNotificationData): Promise<EmailResponse> {
    try {
      // Use the prompt builder to create the prompt
      const prompt = MessagePromptBuilder.buildEmailPrompt(data);
      
      // Generate the email using OpenAI with the expected schema
      const jsonResponse = await this.generateAlertEmail(prompt);
      
      // Parse the JSON response (should be valid JSON due to OpenAI response_format)
      try {
        const parsed = JSON.parse(jsonResponse) as EmailResponse;
        
        // Verify the required fields exist
        if (!parsed.subject || !parsed.body) {
          throw new Error('Response missing required fields');
        }
        
        return parsed;
      } catch (parseError) {
        logger.error('Failed to parse OpenAI response', { 
          alertId: data.alert.id,
          parseError
        });
        throw new Error('Invalid JSON response from OpenAI');
      }
    } catch (error) {
      // Use fallback instead of propagating the error to ensure notifications still go out
      return this.createFallbackMessage(data);
    }
  }

  /**
   * Generates a weather alert email in JSON format using the OpenAI client
   * @param prompt The email generation prompt
   * @returns JSON string with subject and body fields
   */
  private async generateAlertEmail(prompt: string): Promise<string> {
    // Define the expected JSON schema for the response
    const emailSchema = {
      subject: "Weather Alert: High Winds in Your Area",
      body: "This is an example email body that would be generated based on the weather alert."
    };
    
    // Use the generic OpenAI client with our specific schema
    return this.openaiClient.generateCompletion(prompt, emailSchema);
  }

  /**
   * Creates a fallback message when API calls fail
   * @param data The alert notification data
   * @returns A default formatted email message
   */
  private createFallbackMessage(data: AlertNotificationData): EmailResponse {
    const { alert, severity } = data;
    logger.info(`Using fallback message template for alert ${alert.name}`);
    
    return {
      subject: `Alert: ${severity.toUpperCase()} - ${alert.name}`,
      body: MessagePromptBuilder.createFallbackMessage(data)
    };
  }
} 