const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security logger for monitoring suspicious activities
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/security.log')
    })
  ]
});

// Performance logger for monitoring system performance
const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/performance.log')
    })
  ]
});

// Audit logger for tracking important system events
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/audit.log')
    })
  ]
});

// HTTP request logger (file-only, no console output to avoid flooding terminal)
const httpRequestLogger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    })
  ]
});

// Helper functions for structured logging
const logRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    userRole: req.user?.role || 'anonymous',
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString()
  };

  // Only log errors to console, successful requests only to file (to avoid flooding terminal)
  if (res.statusCode >= 400) {
    logger.warn('HTTP Request Error', logData);
  } else {
    // Log successful requests to file only, not console
    httpRequestLogger.http('HTTP Request', logData);
  }
};

const logSecurityEvent = (event, details) => {
  securityLogger.info('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

const logPerformanceMetric = (metric, value, details = {}) => {
  performanceLogger.info('Performance Metric', {
    metric,
    value,
    details,
    timestamp: new Date().toISOString()
  });
};

const logAuditEvent = (action, userId, details = {}) => {
  auditLogger.info('Audit Event', {
    action,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

// Error logging with stack trace
const logError = (error, context = {}) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Database operation logging
const logDatabaseOperation = (operation, collection, details = {}) => {
  logger.debug('Database Operation', {
    operation,
    collection,
    details,
    timestamp: new Date().toISOString()
  });
};

// API response logging
const logApiResponse = (endpoint, statusCode, responseTime, details = {}) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger[level]('API Response', {
    endpoint,
    statusCode,
    responseTime: `${responseTime}ms`,
    details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  securityLogger,
  performanceLogger,
  auditLogger,
  logRequest,
  logSecurityEvent,
  logPerformanceMetric,
  logAuditEvent,
  logError,
  logDatabaseOperation,
  logApiResponse
};