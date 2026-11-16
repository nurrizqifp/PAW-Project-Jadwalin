const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.index);

module.exports = router;

// Tambahan Route dari Resya
router.get('/dosen/dashboard', (req, res) => res.render('dosen/dashboard'));
router.get('/mahasiswa/jadwal', (req, res) => res.render('mahasiswa/jadwal'));