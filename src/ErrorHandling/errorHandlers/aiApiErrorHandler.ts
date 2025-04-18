import axios from 'axios';
import OpenAI from 'openai';
import { logger } from '../../utils/logger';
import { AppError } from '../AppError';
import { handleApiError } from './apiErrorHandler';

/**
 * Error handler for OpenAI specific errors
 * @param error The error that occurred
 * @param context Additional context information for logging
 * @throws AppError with appropriate status code and user message
 */
export function handleOpenAIError(error: unknown, context: Record<string, any> = {}): never {
  // Handle OpenAI specific errors
  if (error instanceof OpenAI.APIError) {
    logger.error('OpenAI API error', {
      ...context,
      status: error.status,
      message: error.message,
      code: error.code,
      type: error.type
    });
    
    if (error.status === 401) {
      throw new AppError(
        'OpenAI authentication failed',
        500,
        'AI service authentication failed. Please contact support.'
      );
    }
    
    if (error.status === 429) {
      throw new AppError(
        'OpenAI rate limit exceeded',
        429,
        'Too many requests to the AI service. Please try again later.'
      );
    }
    
    if (error.status === 400) {
      throw new AppError(
        `OpenAI input error: ${error.message}`,
        400,
        'Invalid request to AI service. Please contact support.'
      );
    }
  }
  
  // Handle missing API key
  if (error instanceof Error && error.message.includes('API key not configured')) {
    logger.error('OpenAI API key not configured', context);
    
    throw new AppError(
      'OpenAI API key not configured',
      500,
      'AI service is not properly configured. Please contact support.'
    );
  }
  
  // Use general API error handler for other errors
  return handleApiError(error, context);
}

/**
 * Error handler for HuggingFace specific errors
 * @param error The error that occurred
 * @param context Additional context information for logging
 * @throws AppError with appropriate status code and user message
 */
export function handleHuggingFaceError(error: unknown, context: Record<string, any> = {}): never {
  // Handle Hugging Face specific errors
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      logger.error('HuggingFace API endpoint not found', context);
      
      throw new AppError(
        'HuggingFace Space not found',
        500,
        'AI service endpoint not found. Please contact support.'
      );
    }
  }
  
  // Use general API error handler for other errors
  return handleApiError(error, {
    ...context,
    service: 'HuggingFace'
  });
} 