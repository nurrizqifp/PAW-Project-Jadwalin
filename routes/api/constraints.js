const express = require('express');
const constraintController = require('../../controllers/constraintController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRole } = require('../../middlewares/rbac');

const router = express.Router();

router.get('/', verifyToken, authorizeRole('admin', 'dosen'), constraintController.daftar);
router.post('/hard', verifyToken, authorizeRole('admin'), constraintController.toggleHard);
router.post('/preferensi', verifyToken, authorizeRole('admin', 'dosen'), constraintController.simpanPreferensi);

module.exports = router;