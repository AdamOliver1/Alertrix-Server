/**
 * Custom Application Error class
 * Used to differentiate between application errors and system errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  userMessage: string;

  /**
   * Constructor for AppError
   * @param message - Error message for developers
   * @param statusCode - HTTP status code
   * @param userMessage - Error message shown to users (default: A general error message)
   */
  constructor(
    message: string, 
    statusCode: number = 500, 
    userMessage: string = 'Something went wrong. Please try again later.'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.isOperational = true; // All AppErrors are considered operational errors
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
} 