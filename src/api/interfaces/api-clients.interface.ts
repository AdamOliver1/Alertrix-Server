import { WeatherData, Location } from '../../types/weather';

/**
 * Interface for the Tomorrow.io weather API client
 */
export interface ITomorrowApiClient {
  /**
   * Gets current weather data for a specific location
   * @param location The location to get weather data for
   * @param units The units to use (metric or imperial)
   * @returns Weather data object
   */
  getCurrentWeather(
    location: Location | string, 
    units?: 'metric' | 'imperial'
  ): Promise<WeatherData>;
}

/**
 * Interface for the OpenAI API client
 */
export interface IOpenAIClient {
  /**
   * Generates text completion using the OpenAI API with JSON response format
   * @param prompt The prompt to send to the API
   * @param jsonSchema Optional example JSON schema to guide the model's output format
   * @param model Optional model to use (defaults to configured model)
   * @returns The generated text (JSON string)
   */
  generateCompletion(
    prompt: string, 
    jsonSchema?: object,
    model?: string
  ): Promise<string>;
}

/**
 * Interface for the Hugging Face API client
 */
export interface IHuggingFaceClient {
  /**
   * Generates text using the Hugging Face Space API
   * @param prompt The prompt to send to the Space
   * @param jsonInstructions Optional instructions for JSON formatting
   * @returns The generated text
   */
  generateText(
    prompt: string,
    jsonInstructions?: string
  ): Promise<string>;
} 