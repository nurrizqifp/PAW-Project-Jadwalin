const ProdukModel = require('../models/produkModel');
const JadwalModel = require('../models/jadwalModel');
const config = require('../config');
const { formatRupiah, formatDate } = require('../utils/helpers');

/**
 * Controller untuk halaman Frontend EJS
 */

exports.index = (req, res) => {
  const produk = ProdukModel.getAll();
  const jadwal = JadwalModel.getAll();

  res.render('index', {
    judul: `${config.appName} - AI Powered Smart Course Scheduling`,
    appName: config.appName,
    produk,
    jadwal,
    formatRupiah,
    formatDate,
    currentDate: formatDate(),
  });
};
