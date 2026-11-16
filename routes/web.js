const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

// Public & Auth Routes
router.get('/', homeController.index);
router.get('/login', homeController.login);
router.get('/forgot-password', homeController.forgotPassword);

// Mahasiswa Routes
router.get('/mahasiswa', homeController.mahasiswaDashboard);
router.get('/mahasiswa/dashboard', homeController.mahasiswaDashboard);
router.get('/mahasiswa/jadwal', homeController.mahasiswaJadwal);
router.get('/mahasiswa/prakrs', homeController.mahasiswaPrakrs);
router.get('/mahasiswa/simulasi', homeController.mahasiswaPrakrs);
router.get('/simulasi', homeController.mahasiswaPrakrs);
router.get('/mahasiswa/notifikasi', homeController.mahasiswaNotifikasi);

// Dosen Routes
router.get('/dosen', homeController.dosenDashboard);
router.get('/dosen/dashboard', homeController.dosenDashboard);
router.get('/dosen/jadwal', homeController.dosenJadwal);
router.get('/dosen/preferensi', homeController.dosenPreferensi);
router.get('/dosen/notifikasi', homeController.dosenNotifikasi);

// Admin / Staf Akademik Routes
router.get('/admin', homeController.adminDashboard);
router.get('/admin/dashboard', homeController.adminDashboard);
router.get('/admin/master/dosen', homeController.adminMasterDosen);
router.get('/admin/master/matkul', homeController.adminMasterMatkul);
router.get('/admin/master/ruangan', homeController.adminMasterRuangan);
router.get('/admin/master/mahasiswa', homeController.adminMasterMahasiswa);
router.get('/admin/constraints', homeController.adminConstraints);
router.get('/admin/constraints/hard', homeController.adminConstraints);
router.get('/admin/constraints/soft', homeController.adminConstraintsSoft);
router.get('/admin/generate', homeController.adminGenerate);
router.get('/admin/jadwal', homeController.adminJadwal);
router.get('/admin/profil', homeController.adminProfil);
router.get('/admin/settings', homeController.adminSettings);
router.get('/admin/periode', homeController.adminPeriode);

module.exports = router;
