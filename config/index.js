const path = require('path');
require('dotenv').config();

module.exports = {
  appName: process.env.APP_NAME || 'Jadwalin',
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  logDir: path.join(__dirname, '..', process.env.LOG_DIR || 'logs'),
  logFile: process.env.LOG_FILE || 'logger.md',
};

