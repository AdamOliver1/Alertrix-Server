import { AppError } from '../AppError';

/**
 * Handles errors related to environment variables and configuration
 * 
 * @param message Error message describing the configuration issue
 * @param missingVars Optional array of missing environment variables
 * @returns AppError with appropriate message
 */
export function handleConfigError(message: string, missingVars?: string[]): AppError {
  let errorMessage = message;
  
  // If specific variables are missing, include them in the error message
  if (missingVars && missingVars.length > 0) {
    errorMessage = `${message}: Missing required environment variables: ${missingVars.join(', ')}`;
  }
  
  const appError = new AppError(
    errorMessage,
    500,
    'Application configuration error. Please contact support.'
  );
  
  // Mark as non-operational since this is a system setup issue
  appError.isOperational = false;
  
  return appError;
}

/**
 * Validates that all required environment variables are present
 * 
 * @param requiredVars Array of required environment variable names
 * @throws AppError if any required variables are missing
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw handleConfigError('Missing required environment variables', missingVars);
  }
} 