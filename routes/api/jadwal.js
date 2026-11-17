const express = require('express');
const jadwalController = require('../../controllers/jadwalController');
const { verifyToken, optionalAuth } = require('../../middlewares/auth');
const { authorizeRole } = require('../../middlewares/rbac');

const router = express.Router();

// Baca jadwal: terbuka (tamu hanya melihat jadwal Terpublikasi), dosen otomatis hanya melihat kelasnya.
router.get('/', optionalAuth, jadwalController.daftar);

// Kelola & publikasi jadwal: hanya staf akademik (PRD bagian Risiko: pengguna tidak berwenang).
router.post('/revisi', verifyToken, authorizeRole('admin'), jadwalController.revisi);
router.post('/publish', verifyToken, authorizeRole('admin'), jadwalController.publish);

module.exports = router;