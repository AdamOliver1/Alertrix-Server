import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../ErrorHandling/AppError';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { config } from '../config';

/**
 * Global error handling middleware
 * Differentiates between AppErrors (operational) and other errors (programming)
 * Sends appropriate error responses based on error type
 */
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let userMessage = 'Something went wrong. Please try again later.';
  let isOperational = false;

  // Extract request information for logging
  const reqInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.headers['user-id'] || 'anonymous'
  };

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    userMessage = err.userMessage;
    isOperational = true;
    
    // Log operational error
    logger.warn(`Operational error: ${err.message}`, {
      error: err,
      request: reqInfo,
      statusCode
    });
  } 
  // Handle Mongoose validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    userMessage = 'Please check your input data.';
    isOperational = true;

    const validationErrors = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');

    // Log validation error
    logger.warn(`Validation error: ${validationErrors}`, {
      error: err,
      request: reqInfo,
      statusCode
    });
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    userMessage = 'Please check your input data.';
    isOperational = true;

    // Log validation error
    logger.warn(`Zod validation error: ${err.message}`, {
      error: err,
      request: reqInfo,
      statusCode
    });
  }
  // Handle other errors (programming or unknown errors)
  else {
    // Log programming or unknown error (higher severity)
    logger.error(`Unhandled error: ${err.message}`, {
      error: err,
      stack: err.stack,
      request: reqInfo,
      statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: config.isProduction && !isOperational 
      ? 'Internal Server Error' // Hide technical details in production for non-operational errors
      : message,
    userMessage,
    // Add error stack in development mode only
    ...(config.isDevelopment && { stack: err.stack })
  });
}; 