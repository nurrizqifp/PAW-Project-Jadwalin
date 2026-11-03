const ProdukModel = require('../models/produkModel');
const JadwalModel = require('../models/jadwalModel');
const config = require('../config');

/**
 * Controller untuk endpoint API
 */

exports.status = (req, res) => {
  res.json({
    status: 'ok',
    aplikasi: config.appName,
    deskripsi: 'AI Powered Smart Course Scheduling - TI UMY',
    uptimeDetik: Math.round(process.uptime()),
    waktuServer: new Date().toISOString(),
    environment: config.nodeEnv,
  });
};

exports.produk = (req, res) => {
  const data = ProdukModel.getAll();
  res.json({
    sukses: true,
    jumlah: data.length,
    data,
  });
};

exports.jadwal = (req, res) => {
  const data = JadwalModel.getAll();
  res.json({
    sukses: true,
    jumlah: data.length,
    data,
  });
};
