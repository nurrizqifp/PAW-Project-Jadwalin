const publicController = require('./publicController');
const mahasiswaController = require('./mahasiswaController');
const dosenController = require('./dosenController');
const adminController = require('./adminController');
const { getBaseData, config } = require('./baseDataHelper');

module.exports = {
  // Helpers
  getBaseData,
  config,

  // Public & Auth
  index: publicController.index,
  login: publicController.login,
  forgotPassword: publicController.forgotPassword,
  info: publicController.info,

  // Mahasiswa
  mahasiswaDashboard: mahasiswaController.dashboard,
  mahasiswaJadwal: mahasiswaController.jadwal,
  mahasiswaPrakrs: mahasiswaController.prakrs,
  mahasiswaNotifikasi: mahasiswaController.notifikasi,

  // Dosen
  dosenDashboard: dosenController.dashboard,
  dosenJadwal: dosenController.jadwal,
  dosenPreferensi: dosenController.preferensi,
  dosenNotifikasi: dosenController.notifikasi,

  // Admin
  adminDashboard: adminController.dashboard,
  adminMasterDosen: adminController.masterDosen,
  adminMasterMatkul: adminController.masterMatkul,
  adminMasterRuangan: adminController.masterRuangan,
  adminMasterMahasiswa: adminController.masterMahasiswa,
  adminConstraints: adminController.constraints,
  adminConstraintsSoft: adminController.constraintsSoft,
  adminGenerate: adminController.generate,
  adminJadwal: adminController.jadwal,
  adminProfil: adminController.profil,
  adminSettings: adminController.settings,
  adminPeriode: adminController.periode
};
