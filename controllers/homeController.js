const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.index = (req, res) => {
  const jadwal = JadwalModel.getAll();
  const jadwalStatus = JadwalModel.getStatus();
  const masterSummary = MasterModel.getSummary();
  const dosenList = MasterModel.getDosen();
  const ruanganList = MasterModel.getRuangan();
  const matkulList = MasterModel.getMataKuliah();
  const constraints = ConstraintModel.getAll();
  const produk = ProdukModel.getAll();

  res.render('index', {
    judul: `${config.appName} — AI Powered Smart Course Scheduling`,
    appName: config.appName,
    jadwal,
    jadwalStatus,
    masterSummary,
    dosenList,
    ruanganList,
    matkulList,
    constraints,
    produk,
  });
};
