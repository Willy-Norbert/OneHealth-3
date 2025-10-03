const express = require('express');
const mongoose = require('mongoose');
const { logger, logPerformanceMetric } = require('../utils/logger');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Basic health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(200).json({
      status: 'success',
      data: healthData
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
});

// Detailed health check with database connectivity
router.get('/detailed', async (req, res) => {
  try {
    const start = Date.now();
    
    // Check database connectivity
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };
    
    // Check CPU usage
    const cpuUsage = process.cpuUsage();
    
    // Check disk space (if available)
    let diskUsage = null;
    try {
      const fs = require('fs');
      const stats = fs.statSync('.');
      diskUsage = {
        available: true,
        lastModified: stats.mtime
      };
    } catch (error) {
      diskUsage = { available: false, error: error.message };
    }
    
    const responseTime = Date.now() - start;
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        readyState: dbState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      memory: memoryUsageMB,
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      disk: diskUsage,
      responseTime: `${responseTime}ms`
    };
    
    // Log performance metric
    logPerformanceMetric('health_check_detailed', responseTime, healthData);
    
    res.status(200).json({
      status: 'success',
      data: healthData
    });
  } catch (error) {
    logger.error('Detailed health check failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Detailed health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    const start = Date.now();
    
    // Test database connection with a simple query
    await mongoose.connection.db.admin().ping();
    
    const responseTime = Date.now() - start;
    
    const dbHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState
      },
      responseTime: `${responseTime}ms`
    };
    
    res.status(200).json({
      status: 'success',
      data: dbHealth
    });
  } catch (error) {
    logger.error('Database health check failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Database health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// System metrics endpoint (admin only)
router.get('/metrics', protect, restrictTo('admin'), async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    logger.error('Metrics collection failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Metrics collection failed'
    });
  }
});

// Readiness probe for Kubernetes/Docker
router.get('/ready', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database not ready'
      });
    }
    
    // Check if critical services are available
    const criticalServices = {
      database: mongoose.connection.readyState === 1,
      // Add other critical services here
    };
    
    const allServicesReady = Object.values(criticalServices).every(ready => ready);
    
    if (allServicesReady) {
      res.status(200).json({
        status: 'success',
        message: 'Service is ready',
        services: criticalServices
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: 'Service not ready',
        services: criticalServices
      });
    }
  } catch (error) {
    logger.error('Readiness check failed', error);
    res.status(503).json({
      status: 'error',
      message: 'Readiness check failed'
    });
  }
});

// Liveness probe for Kubernetes/Docker
router.get('/live', async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Service is alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Liveness check failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Liveness check failed'
    });
  }
});

module.exports = router;