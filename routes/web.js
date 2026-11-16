const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

/**
 * Middleware Penjaga Akses Panel Berbasis Peran (Panel Role Guard)
 * Mengizinkan guest/demo mengakses halaman tanpa halangan,
 * tetapi jika user telah login/memilih peran, ia hanya dibolehkan mengakses panelnya sendiri
 * dan halaman-halaman publik/guest (beranda, jadwal, info, dsb).
 */
function guardPanelRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.query.asRole || req.cookies?.userRole;

    // Jika sudah ada cookie userRole dan mencoba masuk ke panel peran lain:
    if (role && !allowedRoles.includes(role) && role !== 'admin') {
      if (role === 'mahasiswa') {
        return res.redirect('/mahasiswa/dashboard');
      }
      if (role === 'dosen') {
        return res.redirect('/dosen/dashboard');
      }
      return res.redirect('/login');
    }

    next();
  };
}

// Public & Auth Routes (Bebas diakses oleh semua civitas & guest)
router.get('/', homeController.index);
router.get('/info', homeController.info);
router.get('/login', homeController.login);
router.get('/forgot-password', homeController.forgotPassword);
router.get('/simulasi', homeController.mahasiswaPrakrs);

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('userRole');
  res.clearCookie('token');
  res.redirect('/login');
});

// Mahasiswa Routes (Panel Mahasiswa)
router.get('/mahasiswa', guardPanelRole(['mahasiswa', 'admin']), homeController.mahasiswaDashboard);
router.get('/mahasiswa/dashboard', guardPanelRole(['mahasiswa', 'admin']), homeController.mahasiswaDashboard);
router.get('/mahasiswa/jadwal', homeController.mahasiswaJadwal); // Terbuka publik untuk cek jadwal
router.get('/mahasiswa/prakrs', guardPanelRole(['mahasiswa', 'admin']), homeController.mahasiswaPrakrs);
router.get('/mahasiswa/simulasi', homeController.mahasiswaPrakrs);
router.get('/mahasiswa/notifikasi', guardPanelRole(['mahasiswa', 'admin']), homeController.mahasiswaNotifikasi);

// Dosen Routes (Panel Dosen)
router.get('/dosen', guardPanelRole(['dosen', 'admin']), homeController.dosenDashboard);
router.get('/dosen/dashboard', guardPanelRole(['dosen', 'admin']), homeController.dosenDashboard);
router.get('/dosen/jadwal', guardPanelRole(['dosen', 'admin']), homeController.dosenJadwal);
router.get('/dosen/preferensi', guardPanelRole(['dosen', 'admin']), homeController.dosenPreferensi);
router.get('/dosen/notifikasi', guardPanelRole(['dosen', 'admin']), homeController.dosenNotifikasi);

// Admin / Staf Akademik Routes (Panel Admin)
router.get('/admin', guardPanelRole(['admin']), homeController.adminDashboard);
router.get('/admin/dashboard', guardPanelRole(['admin']), homeController.adminDashboard);
router.get('/admin/master/dosen', guardPanelRole(['admin']), homeController.adminMasterDosen);
router.get('/admin/master/matkul', guardPanelRole(['admin']), homeController.adminMasterMatkul);
router.get('/admin/master/ruangan', guardPanelRole(['admin']), homeController.adminMasterRuangan);
router.get('/admin/master/mahasiswa', guardPanelRole(['admin']), homeController.adminMasterMahasiswa);
router.get('/admin/constraints', guardPanelRole(['admin']), homeController.adminConstraints);
router.get('/admin/constraints/hard', guardPanelRole(['admin']), homeController.adminConstraints);
router.get('/admin/constraints/soft', guardPanelRole(['admin']), homeController.adminConstraintsSoft);
router.get('/admin/generate', guardPanelRole(['admin']), homeController.adminGenerate);
router.get('/admin/jadwal', guardPanelRole(['admin']), homeController.adminJadwal);
router.get('/admin/profil', guardPanelRole(['admin']), homeController.adminProfil);
router.get('/admin/settings', guardPanelRole(['admin']), homeController.adminSettings);
router.get('/admin/periode', guardPanelRole(['admin']), homeController.adminPeriode);

module.exports = router;
