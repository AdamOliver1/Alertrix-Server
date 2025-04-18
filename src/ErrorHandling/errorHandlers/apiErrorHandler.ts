import axios from 'axios';
import { logger } from '../../utils/logger';
import { AppError } from '../AppError';

/**
 * Handles axios-based API errors in a consistent way
 * @param error The error that occurred
 * @param context Additional context information for logging
 * @throws AppError with appropriate status code and user message
 */
export function handleApiError(error: unknown, context: Record<string, any> = {}): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a non-2xx status code
      logger.error(`API error response: ${error.response.status}`, {
        ...context,
        status: error.response.status,
        data: error.response.data
      });
      
      // Handle common status codes
      switch (error.response.status) {
        case 400:
          throw new AppError(
            `Bad request: ${error.message}`,
            400,
            'The request was invalid. Please check your input.'
          );
        case 401:
        case 403:
          throw new AppError(
            'API authorization failed',
            500,
            'Service authentication failed. Please contact support.'
          );
        case 404:
          throw new AppError(
            'Resource not found',
            404,
            'The requested resource could not be found.'
          );
        case 429:
          throw new AppError(
            'Rate limit exceeded',
            429,
            'Too many requests. Please try again later.'
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new AppError(
            `Server error: ${error.message}`,
            500,
            'The service is currently unavailable. Please try again later.'
          );
      }
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('API no response', {
        ...context,
        request: error.request
      });
      
      throw new AppError(
        'No response from service',
        503,
        'The service is currently unavailable. Please try again later.'
      );
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new AppError(
        'API timeout',
        504,
        'Request timed out. Please try again later.'
      );
    }
  }
  
  // Generic error fallback
  logger.error('Generic API error', { 
    ...context,
    error
  });
  
  throw new AppError(
    `API error: ${(error as Error).message || 'Unknown error'}`,
    500,
    'An unexpected error occurred. Please try again later.'
  );
} 