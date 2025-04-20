import { AppError } from '../AppError';

/**
 * Standard error handling for resource not found in controllers
 * 
 * @param resourceName Name of the resource (e.g., 'Alert', 'User')
 * @param id ID of the resource that was not found
 * @returns AppError with appropriate message
 */
export function handleResourceNotFound(resourceName: string, id: string): AppError {
  return new AppError(
    `${resourceName} with ID ${id} not found`, 
    404, 
    `The requested ${resourceName.toLowerCase()} could not be found`
  );
}

/**
 * Standard error handling for unauthorized access
 * 
 * @param resourceName Optional resource name for more specific messages
 * @param action Optional action being performed (e.g., 'update', 'delete')
 * @returns AppError with appropriate message
 */
export function handleUnauthorizedAccess(resourceName?: string, action?: string): AppError {
  let message = 'Unauthorized access';
  let userMessage = 'You do not have permission to perform this action';
  
  if (resourceName && action) {
    message = `Unauthorized access: Cannot ${action} ${resourceName}`;
    userMessage = `You do not have permission to ${action} this ${resourceName.toLowerCase()}`;
  }
  
  return new AppError(message, 403, userMessage);
}

/**
 * Standard error handling for missing required fields
 * 
 * @param missingFields Array of field names that are missing
 * @returns AppError with appropriate message
 */
export function handleMissingFields(missingFields: string[]): AppError {
  const formattedFields = missingFields.join(', ');
  
  return new AppError(
    `Missing required fields: ${formattedFields}`,
    400,
    `Please provide the following required fields: ${formattedFields}`
  );
}

/**
 * Standard error handling for validation errors in the controller
 * (This complements the Zod validation but can be used for custom validations)
 * 
 * @param message Error message for logging
 * @param userMessage User-friendly message to display
 * @returns AppError with appropriate message
 */
export function handleValidationErrorInController(message: string, userMessage?: string): AppError {
  return new AppError(
    message,
    400,
    userMessage || 'Please check your input and try again'
  );
} 