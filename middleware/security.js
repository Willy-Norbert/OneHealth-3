const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// NOTE: Avoid express-mongo-sanitize in Express 5 due to req.query reassignment
const hpp = require('hpp');
const compression = require('compression');
// NOTE: Avoid xss-clean in Express 5 for the same reason

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message: message || 'Too many requests from this IP, please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General API rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again in 15 minutes.'
);

// Strict rate limiting for auth endpoints (relaxed in development)
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  process.env.AUTH_RATE_LIMIT_MAX ? Number(process.env.AUTH_RATE_LIMIT_MAX) : (process.env.NODE_ENV === 'production' ? 20 : 1000),
  'Too many authentication attempts, please try again in 15 minutes.'
);

// Strict rate limiting for password reset
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour
  'Too many password reset attempts, please try again in 1 hour.'
);

// Rate limiting for file uploads
const uploadLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  20, // limit each IP to 20 uploads per hour
  'Too many file uploads, please try again in 1 hour.'
);

// Helmet security configuration
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "https:"],
      frameSrc: ["'self'", "https://meet.jit.si"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// MongoDB injection protection (Express 5 compatible, in-place)
const createExpress5CompatibleSanitizer = () => {
  const dangerousKeyPattern = /\$/;
  const containsDotPattern = /\./;

  const sanitizeInPlace = (value, onSanitize, pathPrefix) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        sanitizeInPlace(value[index], onSanitize, `${pathPrefix}[${index}]`);
      }
      return;
    }
    for (const key of Object.keys(value)) {
      const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      if (dangerousKeyPattern.test(key) || containsDotPattern.test(key)) {
        if (typeof onSanitize === 'function') {
          try { onSanitize({ key: fullPath }); } catch {}
        }
        delete value[key];
        continue;
      }
      sanitizeInPlace(value[key], onSanitize, fullPath);
    }
  };

  return (options = {}) => {
    const { onSanitize } = options;
    return (req, res, next) => {
      try {
        if (req.body) sanitizeInPlace(req.body, ({ key }) => onSanitize && onSanitize({ req, key }), 'body');
        if (req.params) sanitizeInPlace(req.params, ({ key }) => onSanitize && onSanitize({ req, key }), 'params');
        if (req.query && typeof req.query === 'object') sanitizeInPlace(req.query, ({ key }) => onSanitize && onSanitize({ req, key }), 'query');
      } catch {}
      next();
    };
  };
};

const mongoSanitizeExpress5 = createExpress5CompatibleSanitizer();
const mongoSanitizeConfig = mongoSanitizeExpress5({
  onSanitize: ({ req, key }) => {
    if (req && req.url) console.warn(`MongoDB injection attempt detected: ${key} in ${req.url}`);
  }
});

// HTTP Parameter Pollution protection
const hppConfig = hpp();

// Compression middleware
const compressionConfig = compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Request size limiter
// Request size limiter - increased for file uploads
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 50 * 1024 * 1024; // 50MB (increased from 10MB for file uploads)

  if (contentLength > maxSize) {
    return res.status(413).json({
      status: 'error',
      message: `Request entity too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`
    });
  }
  next();
};

// IP whitelist for admin endpoints
const adminIPWhitelist = (req, res, next) => {
  const adminIPs = process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',') : [];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Allow localhost and whitelisted IPs
  if (clientIP === '127.0.0.1' || clientIP === '::1' || adminIPs.includes(clientIP)) {
    return next();
  }
  
  // For production, you might want to restrict admin access
  if (process.env.NODE_ENV === 'production' && req.path.startsWith('/admin')) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access restricted to whitelisted IPs'
    });
  }
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    };
    
    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn('Security Warning:', logData);
    }
    
    // Log admin activities
    if (req.user?.role === 'admin') {
      console.log('Admin Activity:', logData);
    }
  });
  
  next();
};

// Additional middleware/shims to match server.js imports

// Strict rate limiter for sensitive routes (e.g., /users)
const strictLimiter = createRateLimit(
  15 * 60 * 1000,
  50,
  'Too many requests. Please try again later.'
);

// Simple request logger (minimal to avoid noisy logs in production)
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 2000 || res.statusCode >= 400) {
      console.log(`[REQ] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
};
const API_KEYS = process.env.API_KEYS || 'tgfl ojfl tyrt oxsv';
// API key validator (optional, enabled when API_KEYS is set)
const validateApiKey = (req, res, next) => {
  if (!process.env.API_KEYS) return next();
  const validKeys = process.env.API_KEYS.split(',').map(s => s.trim());
  const provided = req.headers['x-api-key'];
  if (!provided || !validKeys.includes(provided)) {
    return res.status(401).json({ status: 'fail', message: 'Invalid API key' });
  }
  next();
};

// Placeholder input validator to preserve compatibility
const validateInput = (req, res, next) => next();

// XSS protection (Express 5 compatible, in-place)
const createExpress5CompatibleXssSanitizer = () => {
  const sanitizeString = (input) => {
    if (typeof input !== 'string') return input;
    let output = input.replace(/\0/g, '');
    output = output.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
    output = output.replace(/<[^>]+>/g, '');
    output = output.replace(/(javascript:|data:|vbscript:)/gi, '');
    return output;
  };
  const sanitizeInPlace = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const el = value[i];
        if (typeof el === 'string') value[i] = sanitizeString(el);
        else if (el && typeof el === 'object') sanitizeInPlace(el);
      }
      return;
    }
    for (const key of Object.keys(value)) {
      const current = value[key];
      if (typeof current === 'string') value[key] = sanitizeString(current);
      else if (current && typeof current === 'object') sanitizeInPlace(current);
    }
  };
  return () => (req, res, next) => {
    try {
      if (req.body) sanitizeInPlace(req.body);
      if (req.params) sanitizeInPlace(req.params);
      if (req.query && typeof req.query === 'object') sanitizeInPlace(req.query);
    } catch {}
    next();
  };
};

const xss = createExpress5CompatibleXssSanitizer()();

// Re-exports with names used in server.js
const mongoSanitizeMiddleware = mongoSanitizeConfig;

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  strictLimiter,
  helmetConfig,
  // Export Express 5–compatible sanitizer under expected names
  mongoSanitize: mongoSanitizeConfig,
  hpp: hppConfig,
  xss,
  compressionConfig,
  requestSizeLimiter,
  adminIPWhitelist,
  securityHeaders,
  securityLogger,
  requestLogger,
  validateApiKey,
  validateInput
};