const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

// Public & Auth Routes
router.get('/', homeController.index);
router.get('/login', homeController.login);

// Mahasiswa Routes
router.get('/mahasiswa', homeController.mahasiswaDashboard);
router.get('/mahasiswa/dashboard', homeController.mahasiswaDashboard);
router.get('/mahasiswa/jadwal', homeController.mahasiswaJadwal);
router.get('/mahasiswa/prakrs', homeController.mahasiswaPrakrs);
router.get('/mahasiswa/notifikasi', homeController.mahasiswaNotifikasi);

// Dosen Routes
router.get('/dosen', homeController.dosenDashboard);
router.get('/dosen/dashboard', homeController.dosenDashboard);
router.get('/dosen/jadwal', homeController.dosenJadwal);
router.get('/dosen/preferensi', homeController.dosenPreferensi);

// Admin / Staf Akademik Routes
router.get('/admin', homeController.adminDashboard);
router.get('/admin/dashboard', homeController.adminDashboard);
router.get('/admin/master/dosen', homeController.adminMasterDosen);
router.get('/admin/master/matkul', homeController.adminMasterMatkul);
router.get('/admin/master/ruangan', homeController.adminMasterRuangan);
router.get('/admin/master/mahasiswa', homeController.adminMasterMahasiswa);
router.get('/admin/constraints', homeController.adminConstraints);
router.get('/admin/generate', homeController.adminGenerate);
router.get('/admin/jadwal', homeController.adminJadwal);

module.exports = router;
