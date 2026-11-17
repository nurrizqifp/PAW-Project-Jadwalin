const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Panel Administrasi Akademik
 */
function createAdminHandler(viewName, judulPrefix, activeMenu) {
  return async (req, res, next) => {
    try {
      res.render(viewName, {
        ...(await getBaseData(req.user)),
        judul: `${judulPrefix} — ${config.appName}`,
        currentRole: 'admin',
        activeMenu
      });
    } catch (err) {
      next(err);
    }
  };
}

exports.dashboard = createAdminHandler('admin/dashboard', 'Panel Administrasi Akademik', 'dashboard');
exports.masterDosen = createAdminHandler('admin/master/dosen', 'Master Data Dosen', 'dosen');
exports.masterMatkul = createAdminHandler('admin/master/matkul', 'Master Data Mata Kuliah', 'matkul');
exports.masterRuangan = createAdminHandler('admin/master/ruangan', 'Master Data Ruangan & Laboratorium', 'ruangan');
exports.masterMahasiswa = createAdminHandler('admin/master/mahasiswa', 'Master Data Mahasiswa', 'mahasiswa');
exports.periode = createAdminHandler('admin/master/periode', 'Manajemen Periode & Semester', 'periode');
exports.constraints = createAdminHandler('admin/constraints/hard', 'Manajemen Hard Constraints', 'constraints');
exports.constraintsSoft = createAdminHandler('admin/constraints/soft', 'Manajemen Soft Constraints', 'constraints');
exports.generate = createAdminHandler('admin/generate', 'AI Generator Jadwal', 'generate');
exports.jadwal = createAdminHandler('admin/jadwal', 'Preview & Publikasi Jadwal', 'jadwal');
exports.profil = createAdminHandler('admin/profil', 'Profil Pengelola Akademik', 'profil');
exports.settings = createAdminHandler('admin/settings', 'Pengaturan Sistem', 'settings');
