import { AlertNotificationData } from '../../notifications/notifications/AlertNotificationHandler';


export interface EmailResponse {
  subject: string;
  body: string;
}
/**
 * Utility class for building LLM prompts for email messages
 * Used by different LLM-based message creator implementations
 */
export class MessagePromptBuilder {
  /**
   * Builds a standardized prompt for generating personalized email messages
   * @param data The alert notification data
   * @returns A prompt string formatted for LLM consumption
   */
  static buildEmailPrompt(data: AlertNotificationData): string {
    const { alert, weather, severity, timestamp } = data;
    const { parameter, operator, value } = alert.condition;
    const currentValue = weather[parameter];
    
    return `
Create a short and concise email notification for a weather alert with the following details:

Alert Name: ${alert.name}
Description: ${alert.description}
Severity: ${severity}
Time: ${timestamp.toLocaleString()}

Alert Condition:
- Parameter: ${parameter} 
- Condition: ${parameter} ${operator} ${value}
- Current Value: ${currentValue}

Weather State:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h

Instructions:
1. The email should be brief, informative, and personalized.
2. Connect the description to the alert if possible and make it relevant.
3. Mention both the threshold condition (${parameter} ${operator} ${value}) and current value (${currentValue}) in the email.
4. Keep the entire body under 300 words.
5. End the email with "Best regards,\\nThe Alertrix Team"
6. Return ONLY a JSON object with separate 'subject' and 'body' fields.
7. The subject should be under 80 characters.

Format your response as:
{
  "subject": "Brief subject line here",
  "body": "Your concise email body here\\n\\nBest regards,\\nThe Alertrix Team"
}
`;
  }

  /**
   * Creates a fallback message when LLM API calls fail
   * @param data The alert notification data
   * @returns A formatted fallback message
   */
  static createFallbackMessage(data: AlertNotificationData): string {
    const { alert, weather, severity, timestamp } = data;
    const { parameter, operator, value } = alert.condition;
    const currentValue = weather[parameter];
    
    return `
Alert Details:
-------------
Name: ${alert.name}
Description: ${alert.description}
Severity: ${severity}
Time: ${timestamp.toLocaleString()}

Alert Condition:
-------------
Parameter: ${parameter}
Threshold: ${parameter} ${operator} ${value}
Current Value: ${currentValue}

Weather Conditions:
-----------------
Temperature: ${weather.temperature}°C
Humidity: ${weather.humidity}%
Wind Speed: ${weather.windSpeed} km/h

Best regards,
The Alertrix Team
`;
  }
} 