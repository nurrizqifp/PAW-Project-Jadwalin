const express = require('express');
const publicController = require('../controllers/publicController');
const mahasiswaController = require('../controllers/mahasiswaController');
const dosenController = require('../controllers/dosenController');
const adminController = require('../controllers/adminController');

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

// -------------------------------------------------------------
// 1. Public & Auth Routes (Bebas diakses semua civitas & guest)
// -------------------------------------------------------------
router.get('/', publicController.index);
router.get('/info', publicController.info);
router.get('/login', publicController.login);
router.get('/forgot-password', publicController.forgotPassword);
router.get('/simulasi', mahasiswaController.prakrs);

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('userRole');
  res.clearCookie('token');
  res.redirect('/login');
});

// -------------------------------------------------------------
// 2. Mahasiswa Routes (Panel Mahasiswa)
// -------------------------------------------------------------
router.get('/mahasiswa', guardPanelRole(['mahasiswa', 'admin']), mahasiswaController.dashboard);
router.get('/mahasiswa/dashboard', guardPanelRole(['mahasiswa', 'admin']), mahasiswaController.dashboard);
router.get('/mahasiswa/jadwal', mahasiswaController.jadwal); // Terbuka publik untuk cek jadwal
router.get('/mahasiswa/prakrs', guardPanelRole(['mahasiswa', 'admin']), mahasiswaController.prakrs);
router.get('/mahasiswa/simulasi', mahasiswaController.prakrs);
router.get('/mahasiswa/notifikasi', guardPanelRole(['mahasiswa', 'admin']), mahasiswaController.notifikasi);

// -------------------------------------------------------------
// 3. Dosen Routes (Panel Dosen)
// -------------------------------------------------------------
router.get('/dosen', guardPanelRole(['dosen', 'admin']), dosenController.dashboard);
router.get('/dosen/dashboard', guardPanelRole(['dosen', 'admin']), dosenController.dashboard);
router.get('/dosen/jadwal', guardPanelRole(['dosen', 'admin']), dosenController.jadwal);
router.get('/dosen/preferensi', guardPanelRole(['dosen', 'admin']), dosenController.preferensi);
router.get('/dosen/notifikasi', guardPanelRole(['dosen', 'admin']), dosenController.notifikasi);

// -------------------------------------------------------------
// 4. Admin Routes (Panel Administrasi Akademik)
// -------------------------------------------------------------
router.get('/admin', guardPanelRole(['admin']), adminController.dashboard);
router.get('/admin/dashboard', guardPanelRole(['admin']), adminController.dashboard);
router.get('/admin/master/dosen', guardPanelRole(['admin']), adminController.masterDosen);
router.get('/admin/master/matkul', guardPanelRole(['admin']), adminController.masterMatkul);
router.get('/admin/master/ruangan', guardPanelRole(['admin']), adminController.masterRuangan);
router.get('/admin/master/mahasiswa', guardPanelRole(['admin']), adminController.masterMahasiswa);
router.get('/admin/constraints', guardPanelRole(['admin']), adminController.constraints);
router.get('/admin/constraints/hard', guardPanelRole(['admin']), adminController.constraints);
router.get('/admin/constraints/soft', guardPanelRole(['admin']), adminController.constraintsSoft);
router.get('/admin/generate', guardPanelRole(['admin']), adminController.generate);
router.get('/admin/jadwal', guardPanelRole(['admin']), adminController.jadwal);
router.get('/admin/profil', guardPanelRole(['admin']), adminController.profil);
router.get('/admin/settings', guardPanelRole(['admin']), adminController.settings);
router.get('/admin/periode', guardPanelRole(['admin']), adminController.periode);

module.exports = router;
