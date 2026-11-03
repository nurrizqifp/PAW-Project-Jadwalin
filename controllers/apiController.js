const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.status = (req, res) => {
  const jadwalStatus = JadwalModel.getStatus();
  res.json({
    status: 'ok',
    aplikasi: config.appName,
    deskripsi: 'AI Powered Smart Course Scheduling System',
    uptimeDetik: Math.round(process.uptime()),
    waktuServer: new Date().toISOString(),
    statusJadwal: jadwalStatus.status,
    totalKonflik: jadwalStatus.totalKonflik,
    zeroClash: jadwalStatus.zeroClashConfirmed,
    environment: config.nodeEnv,
  });
};

exports.jadwal = (req, res) => {
  const { dosen, ruang, kelas } = req.query;
  let data = JadwalModel.getAll();

  if (dosen) data = JadwalModel.getByDosen(dosen);
  if (ruang) data = JadwalModel.getByRuang(ruang);
  if (kelas) data = JadwalModel.getByKelas(kelas);

  res.json({
    sukses: true,
    statusJadwal: JadwalModel.getStatus().status,
    jumlah: data.length,
    data,
  });
};

exports.master = (req, res) => {
  res.json({
    sukses: true,
    summary: MasterModel.getSummary(),
    dosen: MasterModel.getDosen(),
    ruangan: MasterModel.getRuangan(),
    mataKuliah: MasterModel.getMataKuliah(),
  });
};

exports.constraints = (req, res) => {
  res.json({
    sukses: true,
    data: ConstraintModel.getAll(),
  });
};

exports.generate = (req, res) => {
  const result = JadwalModel.generateAI();
  res.json({
    sukses: true,
    result,
  });
};

// Endpoint /api/produk tetap disediakan untuk kompatibilitas tugas
exports.produk = (req, res) => {
  const data = ProdukModel.getAll();
  res.json({
    sukses: true,
    jumlah: data.length,
    data,
  });
};
