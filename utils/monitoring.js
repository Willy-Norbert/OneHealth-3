const os = require('os');
const mongoose = require('mongoose');
const { logSystemHealth, logPerformance } = require('./logger');

class SystemMonitor {
  constructor() {
    this.startTime = Date.now();
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      memoryUsage: [],
      cpuUsage: [],
      databaseConnections: 0
    };
    
    // Start monitoring intervals
    this.startMemoryMonitoring();
    this.startCpuMonitoring();
    this.startDatabaseMonitoring();
  }

  // Memory monitoring
  startMemoryMonitoring() {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const systemMem = {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      };

      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        process: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external
        },
        system: systemMem
      });

      // Keep only last 100 entries
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-100);
      }

      // Log if memory usage is high
      const memoryUsagePercent = (systemMem.used / systemMem.total) * 100;
      if (memoryUsagePercent > 80) {
        logSystemHealth('memory', 'warning', {
          usagePercent: memoryUsagePercent,
          processMemory: memUsage
        });
      }
    }, 30000); // Every 30 seconds
  }

  // CPU monitoring
  startCpuMonitoring() {
    let lastCpuUsage = process.cpuUsage();
    let lastTime = Date.now();

    setInterval(() => {
      const currentCpuUsage = process.cpuUsage(lastCpuUsage);
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastTime) / 1000; // Convert to seconds

      const cpuPercent = {
        user: (currentCpuUsage.user / 1000000) / timeDiff * 100,
        system: (currentCpuUsage.system / 1000000) / timeDiff * 100
      };

      this.metrics.cpuUsage.push({
        timestamp: Date.now(),
        user: cpuPercent.user,
        system: cpuPercent.system,
        total: cpuPercent.user + cpuPercent.system
      });

      // Keep only last 100 entries
      if (this.metrics.cpuUsage.length > 100) {
        this.metrics.cpuUsage = this.metrics.cpuUsage.slice(-100);
      }

      // Log if CPU usage is high
      if (cpuPercent.total > 80) {
        logSystemHealth('cpu', 'warning', {
          usagePercent: cpuPercent.total,
          user: cpuPercent.user,
          system: cpuPercent.system
        });
      }

      lastCpuUsage = currentCpuUsage;
      lastTime = currentTime;
    }, 30000); // Every 30 seconds
  }

  // Database monitoring
  startDatabaseMonitoring() {
    setInterval(async () => {
      try {
        const db = mongoose.connection.db;
        if (db) {
          const stats = await db.stats();
          const admin = db.admin();
          const serverStatus = await admin.serverStatus();

          this.metrics.databaseConnections = serverStatus.connections.current;

          // Log database health
          logSystemHealth('database', 'healthy', {
            connections: serverStatus.connections.current,
            operations: serverStatus.opcounters,
            memory: serverStatus.mem,
            uptime: serverStatus.uptime
          });
        }
      } catch (error) {
        logSystemHealth('database', 'error', {
          error: error.message
        });
      }
    }, 60000); // Every minute
  }

  // Request monitoring
  recordRequest(responseTime, statusCode) {
    this.metrics.requests++;
    
    if (statusCode >= 400) {
      this.metrics.errors++;
    }

    this.metrics.responseTime.push({
      timestamp: Date.now(),
      responseTime,
      statusCode
    });

    // Keep only last 1000 entries
    if (this.metrics.responseTime.length > 1000) {
      this.metrics.responseTime = this.metrics.responseTime.slice(-1000);
    }

    // Log slow requests
    if (responseTime > 2000) {
      logPerformance('slow_request', responseTime, {
        statusCode,
        requests: this.metrics.requests
      });
    }
  }

  // Get system metrics
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.responseTime.length > 0
      ? this.metrics.responseTime.reduce((sum, req) => sum + req.responseTime, 0) / this.metrics.responseTime.length
      : 0;

    const errorRate = this.metrics.requests > 0
      ? (this.metrics.errors / this.metrics.requests) * 100
      : 0;

    const currentMemory = process.memoryUsage();
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    };

    return {
      uptime: Math.floor(uptime / 1000), // in seconds
      requests: {
        total: this.metrics.requests,
        errors: this.metrics.errors,
        errorRate: Math.round(errorRate * 100) / 100,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100
      },
      memory: {
        process: currentMemory,
        system: systemMemory,
        usagePercent: Math.round((systemMemory.used / systemMemory.total) * 100 * 100) / 100
      },
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
        current: this.metrics.cpuUsage[this.metrics.cpuUsage.length - 1] || null
      },
      database: {
        connections: this.metrics.databaseConnections,
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        pid: process.pid
      }
    };
  }

  // Get health status
  getHealthStatus() {
    const metrics = this.getMetrics();
    const issues = [];

    // Check memory usage
    if (metrics.memory.usagePercent > 90) {
      issues.push('High memory usage');
    }

    // Check error rate
    if (metrics.requests.errorRate > 10) {
      issues.push('High error rate');
    }

    // Check response time
    if (metrics.requests.avgResponseTime > 2000) {
      issues.push('Slow response times');
    }

    // Check database connection
    if (metrics.database.status !== 'connected') {
      issues.push('Database connection issue');
    }

    // Check CPU usage
    if (metrics.cpu.current && metrics.cpu.current.total > 90) {
      issues.push('High CPU usage');
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'unhealthy',
      issues,
      timestamp: new Date().toISOString(),
      metrics
    };
  }

  // Reset metrics
  resetMetrics() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      memoryUsage: [],
      cpuUsage: [],
      databaseConnections: 0
    };
    this.startTime = Date.now();
  }
}

// Create singleton instance
const systemMonitor = new SystemMonitor();

module.exports = systemMonitor;


