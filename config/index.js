const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  appName: process.env.APP_NAME || 'Jadwalin',
  appVersion: process.env.APP_VERSION || 'v1.0.0',
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  logDir: path.join(__dirname, '..', process.env.LOG_DIR || 'logs'),
  logFile: process.env.LOG_FILE || 'logger.md',
  get geminiApiKey() {
    dotenv.config({ override: true });
    return process.env.GEMINI_API_KEY || '';
  },
  get geminiModel() {
    dotenv.config({ override: true });
    return process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  },
  jwtSecret: process.env.JWT_SECRET || '',
};

