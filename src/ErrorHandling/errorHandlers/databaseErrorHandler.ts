import mongoose from 'mongoose';
import { AppError } from '../AppError';

/**
 * Handles Mongoose connection errors
 * 
 * @param error The error from mongoose connection
 * @returns AppError with appropriate message
 */
export function handleDatabaseConnectionError(error: any): AppError {
  const message = 'Failed to connect to database';
  const userMessage = 'Database connection issue. Please try again later.';
  
  const appError = new AppError(message, 500, userMessage);
  appError.isOperational = false; // Mark as non-operational error
  return appError;
}

