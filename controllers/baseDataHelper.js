const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const config = require('../config');

/**
 * Helper terpusat untuk mengambil snapshot data dasar sistem
 */
function getBaseData() {
  const jadwal = JadwalModel.getAll();
  const jadwalStatus = JadwalModel.getStatus();
  const notifikasiList = JadwalModel.getNotifikasi();
  const masterSummary = MasterModel.getSummary();
  const dosenList = MasterModel.getDosen();
  const ruanganList = MasterModel.getRuangan();
  const kurikulumList = MasterModel.getKurikulum();
  const peminatanList = MasterModel.getPeminatan();
  const constraints = ConstraintModel.getAll();

  const defaultMahasiswaMatkul = MasterModel.getMatkulForMahasiswa(5, 'PR');
  const defaultPrakrs = JadwalModel.rekomendasiPraKrs({
    kodeMatkulList: defaultMahasiswaMatkul.map(m => m.kode),
    prefKelas: 'B',
    prefHari: 'Semua',
    prefWaktu: 'Semua',
    variasiIndex: 0
  });

  return {
    appName: config.appName,
    appVersion: config.appVersion,
    jadwal,
    jadwalStatus,
    notifikasiList,
    masterSummary,
    dosenList,
    ruanganList,
    kurikulumList,
    peminatanList,
    defaultMahasiswaMatkul,
    defaultPrakrs,
    constraints
  };
}

module.exports = {
  getBaseData,
  config
};
