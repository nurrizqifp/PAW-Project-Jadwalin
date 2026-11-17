const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { verifyToken } = require('../../middlewares/auth');

// Endpoint Autentikasi Publik
router.post('/login', authController.login);

// Endpoint Autentikasi Terproteksi
router.get('/me', verifyToken, authController.getMe);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
