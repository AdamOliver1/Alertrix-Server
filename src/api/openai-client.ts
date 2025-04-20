import { injectable } from 'tsyringe';
import OpenAI from 'openai';
import { handleOpenAIError } from '../ErrorHandling/errorHandlers';
import { config } from '../config';
import { IOpenAIClient } from './interfaces/api-clients.interface';

/**
 * Client for interacting with the OpenAI API
 * Centralizes all OpenAI API calls in the application
 * Uses the latest OpenAI SDK best practices
 */
@injectable()
export class OpenAIClient implements IOpenAIClient {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    // Initialize the OpenAI client with API key from config
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    
    // Use config value
    this.defaultModel = config.openai.model;
  }

  /**
   * Generates text completion using the OpenAI API with JSON response format
   * @param prompt The prompt to send to the API
   * @param jsonSchema Optional example JSON schema to guide the model's output format
   * @param model Optional model to use (defaults to configured model)
   * @returns The generated text (JSON string)
   * @throws AppError if there's any issue with the API call
   */
  public async generateCompletion(
    prompt: string, 
    jsonSchema?: object,
    model?: string
  ): Promise<string> {
    try {
      if (!config.openai.apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      const modelToUse = model || this.defaultModel;
      
      // Set system message based on whether a JSON schema was provided
      const systemMessage = jsonSchema 
        ? `Provide output in valid JSON. The data schema should be like this: ${JSON.stringify(jsonSchema)}`
        : 'You are a helpful assistant that formats responses as JSON.';
      
      // Use the chat completions API with JSON response format
      const response = await this.client.chat.completions.create({
        model: modelToUse,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }
      
      return content;
    } catch (error) {
      // Use the specialized OpenAI error handler
      throw handleOpenAIError(error, {
        promptLength: prompt.length,
        hasJsonSchema: !!jsonSchema,
        model: model || this.defaultModel
      });
    }
  }
} 