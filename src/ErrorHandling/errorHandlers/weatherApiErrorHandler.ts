import axios from 'axios';
import { logger } from '../../utils/logger';
import { AppError } from '../AppError';
import { handleApiError } from './apiErrorHandler';
import { Location } from '../../types/weather';

/**
 * Handles weather API specific errors
 * @param error The error that occurred
 * @param location The location used in the API request
 * @param context Additional context information for logging
 * @throws AppError with appropriate status code and user message
 */
export function handleWeatherApiError(
  error: unknown, 
  location: Location | string,
  context: Record<string, any> = {}
): never {
  try {
    // Add location context for better error logging
    const contextWithLocation = {
      ...context,
      location: typeof location === 'string' 
        ? location
        : `${location.lat},${location.lon}`
    };

    // For 404 errors, provide a more specific error message for weather API
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      logger.error('Weather location not found', contextWithLocation);
      
      throw new AppError(
        `Location not found: ${typeof location === 'string' ? location : `${location.lat},${location.lon}`}`,
        404,
        'The requested location could not be found. Please try a different location.'
      );
    }
    
    // For API key configuration errors
    if (error instanceof Error && error.message.includes('API key not configured')) {
      logger.error('Weather API key not configured', contextWithLocation);
      
      throw new AppError(
        'Weather API key not configured',
        500,
        'Weather service is not properly configured. Please contact support.'
      );
    }

    // Use the general API error handler for other error types
    return handleApiError(error, contextWithLocation);
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }
    
    // Fallback error
    logger.error('Unhandled weather API error', { error, location, context });
    throw new AppError(
      `Failed to fetch weather data: ${(error as Error).message || 'Unknown error'}`,
      500,
      'Weather data is temporarily unavailable. Please try again later.'
    );
  }
} 