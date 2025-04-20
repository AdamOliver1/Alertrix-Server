import { SafeParseError } from 'zod';
import { AppError } from '../AppError';

/**
 * Handles Zod validation errors consistently across the application
 * 
 * @param result The Zod SafeParseError result
 * @param errorTitle A title for the error (e.g., 'Invalid alert data')
 * @param userMessage A user-friendly message
 * @returns AppError that can be thrown
 */
export function handleValidationError(
  result: SafeParseError<any>,
  errorTitle: string = 'Validation Error',
  userMessage: string = 'Please check your input and try again.'
): AppError {
  // Extract the formatted validation issues
  const formattedErrors = result.error.format();
  
  // Create a more detailed message for the logs
  const detailedMessage = `${errorTitle}: ${JSON.stringify(formattedErrors)}`;
  
  return new AppError(detailedMessage, 400, userMessage);
}

/**
 * Handles resource not found errors consistently
 * 
 * @param resourceType The type of resource (e.g., 'Alert')
 * @param id The ID that was not found
 * @returns AppError that can be thrown
 */
export function handleNotFoundError(resourceType: string, id: string): AppError {
  return new AppError(
    `${resourceType} with ID ${id} not found`,
    404,
    `${resourceType} not found`
  );
}

/**
 * Handles validation of business rules
 * 
 * @param condition The condition to check (if false, will throw)
 * @param message The error message
 * @param userMessage A user-friendly message
 * @param statusCode HTTP status code to use (default 400)
 * @throws AppError if condition is false
 */
export function validateBusinessRule(
  condition: boolean,
  message: string,
  userMessage: string,
  statusCode: number = 400
): void {
  if (!condition) {
    throw new AppError(message, statusCode, userMessage);
  }
} 