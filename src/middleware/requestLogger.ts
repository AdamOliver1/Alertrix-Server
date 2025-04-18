import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { stream } from '../utils/logger';

/**
 * Custom request logging format that includes:
 * - HTTP method
 * - URL
 * - Status code
 * - Response time
 * - Content length
 * - User agent
 * - Request ID (if available)
 */
const logFormat = ':method :url :status :response-time ms - :res[content-length] - :user-agent - :req[request-id]';

// Create a middleware using morgan to log all HTTP requests
export const requestLogger = morgan(logFormat, { stream });

/**
 * Add request tracking middleware
 * Adds a unique request ID to each request for tracking across logs
 */
export const requestTracker = (req: Request, res: Response, next: NextFunction): void => {
  // Add timestamp to track when request started
  req.requestTime = Date.now();
  
  // Add request ID if not already present (may be set by API gateway or load balancer)
  if (!req.headers['request-id']) {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    req.headers['request-id'] = requestId;
  }
  
  // Continue to next middleware
  next();
}; 