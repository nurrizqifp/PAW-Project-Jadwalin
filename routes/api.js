const express = require('express');
const apiController = require('../controllers/apiController');
const authRoutes = require('./api/auth');
const { verifyToken } = require('../middlewares/auth');
const { authorizeRole } = require('../middlewares/rbac');

const router = express.Router();

// Endpoint Autentikasi
router.use('/auth', authRoutes);

// Endpoint Publik (Non-PII)
router.get('/status', apiController.status);
router.get('/jadwal', apiController.jadwal);

// Endpoint Mahasiswa & Admin
router.post('/jadwal/prakrs', verifyToken, authorizeRole('mahasiswa', 'admin'), apiController.rekomendasiPrakrs);
router.post('/jadwal/prakrs/simpan', verifyToken, authorizeRole('mahasiswa', 'admin'), apiController.simpanPrakrs);
router.post('/chat', verifyToken, apiController.chatAssistant);

// Endpoint Dosen & Admin
router.post('/constraints/preferensi', verifyToken, authorizeRole('dosen', 'admin'), apiController.simpanPreferensiDosen);
router.delete('/constraints/preferensi/:id', verifyToken, authorizeRole('dosen', 'admin'), apiController.deletePreferensiDosen);

// Endpoint Khusus Admin Akademik
router.post('/jadwal/revisi', verifyToken, authorizeRole('admin'), apiController.revisiJadwal);
router.post('/jadwal/publish', verifyToken, authorizeRole('admin'), apiController.publishJadwal);
router.get('/master', verifyToken, authorizeRole('admin'), apiController.master);
router.post('/master', verifyToken, authorizeRole('admin'), apiController.tambahMaster);
router.put('/master/dosen/:id', verifyToken, authorizeRole('admin'), apiController.updateDosen);
router.delete('/master/dosen/:id', verifyToken, authorizeRole('admin'), apiController.deleteDosen);
router.put('/master/matkul/:id', verifyToken, authorizeRole('admin'), apiController.updateMatkul);
router.delete('/master/matkul/:id', verifyToken, authorizeRole('admin'), apiController.deleteMatkul);
router.put('/master/ruangan/:id', verifyToken, authorizeRole('admin'), apiController.updateRuangan);
router.delete('/master/ruangan/:id', verifyToken, authorizeRole('admin'), apiController.deleteRuangan);
router.put('/master/mahasiswa/:id', verifyToken, authorizeRole('admin'), apiController.updateMahasiswa);
router.delete('/master/mahasiswa/:id', verifyToken, authorizeRole('admin'), apiController.deleteMahasiswa);
router.put('/master/periode/:id', verifyToken, authorizeRole('admin'), apiController.updatePeriode);
router.delete('/master/periode/:id', verifyToken, authorizeRole('admin'), apiController.deletePeriode);
router.get('/constraints', verifyToken, authorizeRole('admin'), apiController.constraints);
router.post('/constraints/hard', verifyToken, authorizeRole('admin'), apiController.toggleConstraint);
router.post('/generate', verifyToken, authorizeRole('admin'), apiController.generate);

module.exports = router;
