import { injectable } from 'tsyringe';
import { logger } from '../utils/logger';

/**
 * Generic notification handler interface
 * TData is the type of data the handler can process
 */
export interface Handler<TData> {
  handle(data: TData): Promise<void>;
}

/**
 * Interface for the notification service
 * TData is the type of data that will be sent in notifications
 */
export interface Notifier<TData> {
  registerHandler(handler: Handler<TData>): Notifier<TData>;
  notify(data: TData): Promise<void>;
  notifyAsync(data: TData): void;
}

/**
 * Generic notification service that can work with any data type
 * Handlers can be registered to process the notifications
 * The service doesn't care about the structure of the data,
 * it just passes it to the registered handlers
 */
export abstract class NotificationHandler<TData> implements Notifier<TData> {
  private handlers: Handler<TData>[] = [];

  /**
   * Register a new handler for notifications
   * Returns this for method chaining
   */
  registerHandler(handler: Handler<TData>): Notifier<TData> {
    this.handlers.push(handler);
    return this;
  }

  /**
   * Send a notification to all registered handlers and wait for completion
   * Handlers are executed in parallel
   */
  async notify(data: TData): Promise<void> {
    await Promise.all(
      this.handlers.map(handler => handler.handle(data))
    );
  }

  /**
   * Send a notification to all registered handlers asynchronously
   * Does not wait for completion and doesn't block the caller
   * Any errors will be logged but not propagated back to the caller
   */
  notifyAsync(data: TData): void {
    // Run all handlers in the background without awaiting
    Promise.all(
      this.handlers.map(handler => 
        handler.handle(data).catch(error => {
          // Log any errors to error.log but don't propagate them
          logger.error('Async notification handler failed', {
            error,
            handlerType: handler.constructor.name,
            dataType: typeof data
          });
        })
      )
    ).catch(error => {
      // This should never happen as we catch errors for each handler
      // But just in case, log any unexpected errors
      logger.error('Unexpected error in async notification process', { error });
    });
  }
} 