import dotenv from 'dotenv';
dotenv.config();

import winston from 'winston';
import 'winston-mongodb'; // This automatically adds MongoDB transport

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // MongoDB transport
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      options: { 
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      collection: 'server_logs',
      level: 'error',
      capped: true,
      cappedSize: 10000000 // 10MB
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Handle uncaught promise rejections
process.on('unhandledRejection', (ex) => {
  logger.error('UNHANDLED REJECTION:', ex);
});

export default logger;
