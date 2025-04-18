import 'reflect-metadata';
import mongoose from 'mongoose';
import app, { connectToDatabase } from './app';
import { config } from './config';
import { Scheduler } from './schedule-tasks/scheduler';
import { logger } from './utils/logger';

// Import the container to initialize dependency injection
import './app-registry/container';

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { reason });
  process.exit(1);
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
    
    // Start the alert evaluation scheduler
    const scheduler = new Scheduler();
    scheduler.start();
    
    // Handle graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received, shutting down...`);
      
      // Stop the scheduler
      scheduler.stop();
      
      // Close the server
      server.close(() => {
        // Close database connection
        mongoose.connection.close().then(() => {
          process.exit(0);
        });
      });
    };
    
    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Start the application
startServer(); 