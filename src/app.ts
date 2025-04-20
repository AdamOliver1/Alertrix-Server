import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, requestTracker } from './middleware/requestLogger';
import { logger } from './utils/logger';
import { handleDatabaseConnectionError } from './ErrorHandling/errorHandlers';

// Create Express application
const app = express();

// Add middleware
app.use(requestTracker);
app.use(requestLogger);
app.use(cors());
app.use(express.json());

// Add routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Database connection
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    // Use the database connection error handler for consistent error formatting
    const connectionError = handleDatabaseConnectionError(error);
    logger.error(connectionError.message, { 
      error,
      isOperational: connectionError.isOperational,
      statusCode: connectionError.statusCode 
    });
    
    process.exit(1);
  }
};

export default app; 