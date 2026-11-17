const express = require('express');
const publicController = require('../controllers/publicController');
const mahasiswaController = require('../controllers/mahasiswaController');
const dosenController = require('../controllers/dosenController');
const adminController = require('../controllers/adminController');
const { verifyToken, optionalAuth } = require('../middlewares/auth');
const { authorizeRole } = require('../middlewares/rbac');

const router = express.Router();

// -------------------------------------------------------------
// 1. Public & Auth Routes (Tanpa PII pengguna — Least Privilege)
// -------------------------------------------------------------
router.get('/', optionalAuth, publicController.index);
router.get('/info', optionalAuth, publicController.info);
router.get('/login', optionalAuth, publicController.login);
router.get('/forgot-password', optionalAuth, publicController.forgotPassword);

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('token');
  res.clearCookie('userRole');
  res.redirect('/login');
});

// -------------------------------------------------------------
// 2. Mahasiswa Routes (Wajib JWT & Role Mahasiswa/Admin)
// -------------------------------------------------------------
router.get('/mahasiswa', verifyToken, authorizeRole('mahasiswa', 'admin'), mahasiswaController.dashboard);
router.get('/mahasiswa/dashboard', verifyToken, authorizeRole('mahasiswa', 'admin'), mahasiswaController.dashboard);
router.get('/mahasiswa/jadwal', verifyToken, authorizeRole('mahasiswa', 'admin'), mahasiswaController.jadwal);
router.get('/mahasiswa/prakrs', verifyToken, authorizeRole('mahasiswa', 'admin'), mahasiswaController.prakrs);
router.get('/mahasiswa/notifikasi', verifyToken, authorizeRole('mahasiswa', 'admin'), mahasiswaController.notifikasi);

// -------------------------------------------------------------
// 3. Dosen Routes (Wajib JWT & Role Dosen/Admin)
// -------------------------------------------------------------
router.get('/dosen', verifyToken, authorizeRole('dosen', 'admin'), dosenController.dashboard);
router.get('/dosen/dashboard', verifyToken, authorizeRole('dosen', 'admin'), dosenController.dashboard);
router.get('/dosen/jadwal', verifyToken, authorizeRole('dosen', 'admin'), dosenController.jadwal);
router.get('/dosen/preferensi', verifyToken, authorizeRole('dosen', 'admin'), dosenController.preferensi);
router.get('/dosen/notifikasi', verifyToken, authorizeRole('dosen', 'admin'), dosenController.notifikasi);

// -------------------------------------------------------------
// 4. Admin Routes (Wajib JWT & Role Admin)
// -------------------------------------------------------------
router.get('/admin', verifyToken, authorizeRole('admin'), adminController.dashboard);
router.get('/admin/dashboard', verifyToken, authorizeRole('admin'), adminController.dashboard);
router.get('/admin/master/dosen', verifyToken, authorizeRole('admin'), adminController.masterDosen);
router.get('/admin/master/matkul', verifyToken, authorizeRole('admin'), adminController.masterMatkul);
router.get('/admin/master/ruangan', verifyToken, authorizeRole('admin'), adminController.masterRuangan);
router.get('/admin/master/mahasiswa', verifyToken, authorizeRole('admin'), adminController.masterMahasiswa);
router.get('/admin/constraints', verifyToken, authorizeRole('admin'), adminController.constraints);
router.get('/admin/constraints/hard', verifyToken, authorizeRole('admin'), adminController.constraints);
router.get('/admin/constraints/soft', verifyToken, authorizeRole('admin'), adminController.constraintsSoft);
router.get('/admin/generate', verifyToken, authorizeRole('admin'), adminController.generate);
router.get('/admin/jadwal', verifyToken, authorizeRole('admin'), adminController.jadwal);
router.get('/admin/profil', verifyToken, authorizeRole('admin'), adminController.profil);
router.get('/admin/settings', verifyToken, authorizeRole('admin'), adminController.settings);
router.get('/admin/periode', verifyToken, authorizeRole('admin'), adminController.periode);

module.exports = router;
