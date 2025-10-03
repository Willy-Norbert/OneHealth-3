const { logger, logRequest, logSecurityEvent, logPerformanceMetric, logAuditEvent } = require('../utils/logger');

// Request monitoring middleware
const requestMonitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req, res, duration);
    
    // Log performance metrics for slow requests
    if (duration > 1000) {
      logPerformanceMetric('slow_request', duration, {
        url: req.url,
        method: req.method,
        userId: req.user?.id
      });
    }
  });
  
  next();
};

// Error monitoring middleware
const errorMonitoring = (err, req, res, next) => {
  logger.error('Application Error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });
  
  next(err);
};

// Security monitoring middleware
const securityMonitoring = (req, res, next) => {
  // Monitor for suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /on\w+\s*=/i // Event handler injection
  ];
  
  const requestString = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      logSecurityEvent('Suspicious Request Pattern', {
        pattern: pattern.toString(),
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body
      });
      break;
    }
  }
  
  // Monitor for brute force attempts
  const clientIP = req.ip;
  if (!req.securityAttempts) {
    req.securityAttempts = new Map();
  }
  
  if (!req.securityAttempts.has(clientIP)) {
    req.securityAttempts.set(clientIP, { count: 0, lastAttempt: Date.now() });
  }
  
  const attempts = req.securityAttempts.get(clientIP);
  const timeDiff = Date.now() - attempts.lastAttempt;
  
  if (timeDiff < 60000) { // Within 1 minute
    attempts.count++;
    if (attempts.count > 10) {
      logSecurityEvent('Potential Brute Force Attack', {
        ip: clientIP,
        attempts: attempts.count,
        url: req.url,
        userAgent: req.get('User-Agent')
      });
    }
  } else {
    attempts.count = 1;
    attempts.lastAttempt = Date.now();
  }
  
  next();
};

// Performance monitoring middleware
const performanceMonitoring = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] * 1000 + diff[1] * 1e-6; // Convert to milliseconds
    
    // Log performance metrics
    logPerformanceMetric('request_duration', duration, {
      endpoint: req.url,
      method: req.method,
      statusCode: res.statusCode,
      userId: req.user?.id
    });
    
    // Monitor memory usage
    const memUsage = process.memoryUsage();
    logPerformanceMetric('memory_usage', memUsage.heapUsed, {
      endpoint: req.url,
      method: req.method,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    });
  });
  
  next();
};

// Database monitoring middleware
const databaseMonitoring = (req, res, next) => {
  const originalSend = res.send;
  let responseSize = 0;
  
  res.send = function(data) {
    responseSize = Buffer.byteLength(data, 'utf8');
    
    // Log database-related metrics
    if (req.url.includes('/api/')) {
      logPerformanceMetric('api_response_size', responseSize, {
        endpoint: req.url,
        method: req.method,
        statusCode: res.statusCode
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// API usage monitoring middleware
const apiUsageMonitoring = (req, res, next) => {
  // Track API usage by endpoint
  const endpoint = req.url.split('?')[0]; // Remove query parameters
  
  res.on('finish', () => {
    logAuditEvent('api_usage', req.user?.id || 'anonymous', {
      endpoint,
      method: req.method,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// Health check monitoring
const healthCheckMonitoring = (req, res, next) => {
  if (req.url === '/health' || req.url === '/health/check') {
    const healthData = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
    
    logPerformanceMetric('health_check', healthData.uptime, healthData);
  }
  
  next();
};

// Real-time metrics collection
const collectMetrics = () => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
    activeConnections: 0 // This would be tracked by your application
  };
  
  logPerformanceMetric('system_metrics', metrics.uptime, metrics);
  
  return metrics;
};

// Start metrics collection interval
setInterval(collectMetrics, 60000); // Collect every minute

module.exports = {
  requestMonitoring,
  errorMonitoring,
  securityMonitoring,
  performanceMonitoring,
  databaseMonitoring,
  apiUsageMonitoring,
  healthCheckMonitoring,
  collectMetrics
};