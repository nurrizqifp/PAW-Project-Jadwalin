const express = require('express');
const notifikasiController = require('../../controllers/notifikasiController');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', notifikasiController.daftar);
router.put('/read-all', notifikasiController.tandaiSemuaDibaca);
router.put('/:id/read', notifikasiController.tandaiDibaca);

module.exports = router;