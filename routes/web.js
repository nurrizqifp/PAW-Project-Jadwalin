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
    // 1. Dukung switch role langsung via query parameter ?asRole=... atau ?role=...
    const switchTarget = req.query.asRole || req.query.role;
    if (switchTarget) {
      res.cookie('userRole', switchTarget, { maxAge: 604800000, path: '/' });
      req.cookies = req.cookies || {};
      req.cookies.userRole = switchTarget;
    }

    const role = switchTarget || req.cookies?.userRole;

    // 2. Jika belum ada cookie (guest demo), izinkan penjelajahan panel untuk keperluan pengujian
    if (!role) {
      return next();
    }

    // 3. Admin memiliki hak akses penuh ke semua panel
    if (role === 'admin') {
      return next();
    }

    // 4. Jika role tidak termasuk yang diizinkan untuk panel ini:
    if (!allowedRoles.includes(role)) {
      return res.status(403).render('errors/403', {
        judul: '403 — Akses Dibatasi · Jadwalin',
        roleDibutuhkan: allowedRoles,
        roleUser: role,
        appName: process.env.APP_NAME || 'Jadwalin',
        appVersion: process.env.APP_VERSION || 'v.21'
      });
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
