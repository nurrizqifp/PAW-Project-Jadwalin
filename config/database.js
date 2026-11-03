const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'jadwalin_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

let sequelize = null;

// Helper untuk inisialisasi koneksi database saat PostgreSQL diaktifkan
const connectDatabase = async () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
      }
    );
  }

  try {
    await sequelize.authenticate();
    console.log('Database PostgreSQL terhubung dengan sukses.');
    return sequelize;
  } catch (error) {
    console.warn('Database belum aktif / tidak terhubung (menggunakan model statis memory):', error.message);
    return null;
  }
};

module.exports = {
  dbConfig,
  connectDatabase,
  getSequelize: () => sequelize,
};

