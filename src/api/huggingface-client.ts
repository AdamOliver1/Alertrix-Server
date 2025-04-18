import { injectable } from 'tsyringe';
import axios from 'axios';
import { logger } from '../utils/logger';
import { handleHuggingFaceError } from '../ErrorHandling/errorHandlers';
import { config } from '../config';

/**
 * Client for interacting with the Hugging Face Space API
 * Centralizes all Hugging Face API calls in the application
 */
@injectable()
export class HuggingFaceClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = config.huggingface.spaceUrl || 'https://adamo1-alertrix2.hf.space/generate';
  }

  /**
   * Generates text using the Hugging Face Space API
   * @param prompt The prompt to send to the Space
   * @param jsonInstructions Optional instructions for JSON formatting
   * @returns The generated text
   * @throws AppError if there's any issue with the API call
   */
  public async generateText(
    prompt: string,
    jsonInstructions?: string
  ): Promise<string> {
    try {
      // If JSON instructions were provided, add them to the prompt
      const finalPrompt = jsonInstructions 
        ? `${prompt}\n\n${jsonInstructions}`
        : prompt;
      
      const response = await axios.post(
        this.apiUrl,
        { prompt: finalPrompt },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      const result = this.extractTextFromResponse(response.data);
      
      if (!result || result.trim() === '') {
        throw new Error('Empty response from HuggingFace API');
      }
      
      return result;
    } catch (error) {
      // Use the specialized HuggingFace error handler
      throw handleHuggingFaceError(error, {
        promptLength: prompt.length,
        hasJsonInstructions: !!jsonInstructions
      });
    }
  }

  /**
   * Extracts text from various HuggingFace API response formats
   * @param responseData The API response data object
   * @returns Extracted text string or stringified JSON if format is unknown
   */
  private extractTextFromResponse(responseData: any): string {
    if (!responseData) return '';
    
    // Handle array data format
    if (responseData.data && Array.isArray(responseData.data)) {
      return String(responseData.data[0]);
    } 
    
    // Handle common text field formats
    if (responseData.generated_text) {
      return responseData.generated_text;
    } 
    
    if (responseData.text) {
      return responseData.text;
    }
    
    // Default: return stringified response
    return JSON.stringify(responseData);
  }
} 