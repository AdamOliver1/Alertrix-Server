import { Request, Response, NextFunction } from 'express';

/**
 * Async handler utility to avoid repetitive try/catch blocks in controllers
 * Wraps controller methods to automatically catch errors and pass them to next()
 * 
 * @param fn - Asynchronous controller function to wrap
 * @returns Wrapped function that handles errors automatically
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 