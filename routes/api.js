const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.status);
router.get('/jadwal', apiController.jadwal);
router.post('/jadwal/prakrs', apiController.rekomendasiPrakrs);
router.post('/jadwal/revisi', apiController.revisiJadwal);
router.post('/jadwal/publish', apiController.publishJadwal);
router.get('/master', apiController.master);
router.post('/master', apiController.tambahMaster);
router.put('/master/dosen/:id', apiController.updateDosen);
router.delete('/master/dosen/:id', apiController.deleteDosen);
router.get('/constraints', apiController.constraints);
router.post('/constraints/preferensi', apiController.simpanPreferensiDosen);
router.post('/constraints/hard', apiController.toggleConstraint);
router.post('/generate', apiController.generate);
router.get('/produk', apiController.produk);

module.exports = router;
