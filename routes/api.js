const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.status);
router.get('/jadwal', apiController.jadwal);
router.get('/master', apiController.master);
router.get('/constraints', apiController.constraints);
router.post('/generate', apiController.generate);
router.get('/produk', apiController.produk);

module.exports = router;
