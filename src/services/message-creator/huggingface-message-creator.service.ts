import { injectable, inject } from 'tsyringe';
import { IMessageCreator } from '../interfaces/message-creator.interface';
import { AlertNotificationData } from '../../notifications/notifications/AlertNotificationHandler';
import { EmailResponse, MessagePromptBuilder } from './message-prompt-builder';
import { HuggingFaceClient } from '../../api';
import { Tokens } from '../../app-registry/tokens';
import { logger } from '../../utils/logger';

@injectable()
export class HuggingfaceMessageCreator implements IMessageCreator {
  constructor(
    @inject(Tokens.HuggingFaceClient) private huggingFaceClient: HuggingFaceClient
  ) {}

  /**
   * Creates an email message for an alert notification using Hugging Face
   * @param data The alert notification data
   * @returns An object containing the email subject and body
   */
  async createMessage(data: AlertNotificationData): Promise<EmailResponse> {
    try {
      // Use the prompt builder to create the prompt
      const prompt = MessagePromptBuilder.buildEmailPrompt(data);
      
      // Generate the email using Hugging Face with JSON instructions
      const jsonResponse = await this.generateAlertEmail(prompt);
      
      try {
        // Try to parse the response as JSON directly
        const parsed = JSON.parse(jsonResponse) as EmailResponse;
        
        // Verify the required fields exist
        if (!parsed.subject || !parsed.body) {
          throw new Error('Response missing required fields');
        }
        
        // Handle escaped newlines in the body
        parsed.body = this.convertEscapedNewlines(parsed.body);
        
        return parsed;
      } catch (parseError) {
        // If parsing fails, attempt to extract JSON from text
        logger.warn('Failed to parse HuggingFace response', {
          alertId: data.alert.id
        });
        
        // As a fallback, try to extract JSON from the text
        const extractedJson = this.extractJsonFromText(jsonResponse);
        if (extractedJson) {
          return {
            subject: extractedJson.subject || '',
            body: this.convertEscapedNewlines(extractedJson.body || '')
          };
        }
        
        throw new Error('Unable to parse JSON response from Hugging Face');
      }
    } catch (error) {
      // Use fallback instead of propagating the error to ensure notifications still go out
      return this.createFallbackMessage(data);
    }
  }

  /**
   * Generates a weather alert email using the Hugging Face client
   * @param prompt The base prompt to send to the model
   * @returns Generated text that should contain JSON
   */
  private async generateAlertEmail(prompt: string): Promise<string> {
    // Define JSON formatting instructions for the model
    const jsonInstructions = `
IMPORTANT: You must respond ONLY with a valid JSON object in the following format:
{
  "subject": "Brief and informative email subject",
  "body": "The email body content with proper formatting"
}
Do not include any explanation, introduction, or additional text outside of the JSON structure.
`;
    
    // Use the Hugging Face client with JSON instructions
    return this.huggingFaceClient.generateText(prompt, jsonInstructions);
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
  
  /**
   * Attempts to extract a JSON object from a text string (fallback method)
   * @param text Text that may contain a JSON object
   * @returns Parsed JSON object or null if no valid JSON found
   */
  private extractJsonFromText(text: string): EmailResponse | null {
    // No JSON markers found
    if (!text.includes('{') || !text.includes('}')) {
      return null;
    }
    
    try {
      // Find the outermost JSON object
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        return null;
      }
      
      // Extract and parse the JSON part
      const jsonString = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Converts escaped newline characters (\n) to actual line breaks
   */
  private convertEscapedNewlines(text: string): string {
    if (!text) return '';
    return text.replace(/\\n/g, '\n');
  }
} 