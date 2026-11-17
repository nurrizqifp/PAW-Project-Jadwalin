const { Sequelize } = require('sequelize');
const dbConfigs = require('./config');

const env = process.env.NODE_ENV || 'development';
const currentConfig = dbConfigs[env] || dbConfigs.development;

const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    port: currentConfig.port,
    dialect: currentConfig.dialect,
    logging: currentConfig.logging,
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Database] PostgreSQL terhubung dengan sukses.');
    return sequelize;
  } catch (error) {
    console.warn('[Database] Belum aktif / tidak terhubung (menggunakan fallback memori jika offline):', error.message);
    return null;
  }
};

module.exports = {
  dbConfig: currentConfig,
  connectDatabase,
  getSequelize: () => sequelize,
  sequelize,
};
