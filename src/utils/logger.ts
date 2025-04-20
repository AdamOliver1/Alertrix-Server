import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Determine if we're in production directly from env vars
// This avoids circular dependency with config module
const isProd = process.env.NODE_ENV === 'production';

// Create the logger
const logger: Logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'alertrix-backend' },
  transports: [
    // Write to files
    new transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  ]
});

// Add console logging in development
if (!isProd) {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// Create a stream object for Morgan HTTP logger
const stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  }
};

export { logger, stream }; 