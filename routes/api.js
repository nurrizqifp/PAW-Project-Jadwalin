const express = require('express');
const apiController = require('../controllers/apiController');
const authRoutes = require('./api/auth');

const router = express.Router();

// Autentikasi Pengguna & RBAC
router.use('/auth', authRoutes);

router.get('/status', apiController.status);
router.get('/jadwal', apiController.jadwal);
router.post('/jadwal/prakrs', apiController.rekomendasiPrakrs);
router.post('/jadwal/revisi', apiController.revisiJadwal);
router.post('/jadwal/publish', apiController.publishJadwal);
// Master Data CRUD (F-01 - Bima & Nisrina)
router.get('/master', apiController.master);
router.post('/master', apiController.tambahMaster);

// Master Dosen
router.put('/master/dosen/:id', apiController.updateDosen);
router.delete('/master/dosen/:id', apiController.deleteDosen);

// Master Mata Kuliah
router.put('/master/matkul/:id', apiController.updateMatkul);
router.delete('/master/matkul/:id', apiController.deleteMatkul);

// Master Ruangan
router.put('/master/ruangan/:id', apiController.updateRuangan);
router.delete('/master/ruangan/:id', apiController.deleteRuangan);

// Master Mahasiswa
router.put('/master/mahasiswa/:id', apiController.updateMahasiswa);
router.delete('/master/mahasiswa/:id', apiController.deleteMahasiswa);
router.get('/constraints', apiController.constraints);
router.post('/constraints/preferensi', apiController.simpanPreferensiDosen);
router.post('/constraints/hard', apiController.toggleConstraint);
router.post('/generate', apiController.generate);
router.get('/produk', apiController.produk);

module.exports = router;
