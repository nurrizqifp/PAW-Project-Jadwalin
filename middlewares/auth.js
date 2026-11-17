const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.jwtSecret || crypto.randomBytes(32).toString('hex');

function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && (req.cookies.jwt || req.cookies.token)) {
    return req.cookies.jwt || req.cookies.token;
  }
  return null;
}

/**
 * Middleware untuk memverifikasi autentikasi pengguna via JWT (Cookie atau Bearer Header)
 */
const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        sukses: false,
        pesan: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (res.locals) {
      res.locals.currentUser = decoded;
    }
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        sukses: false,
        pesan: 'Sesi login tidak valid atau telah kadaluarsa.',
      });
    }
    return res.redirect('/login');
  }
};

/**
 * Middleware autentikasi opsional (tidak memblokir jika tidak login)
 */
const optionalAuth = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (res.locals) {
        res.locals.currentUser = decoded;
      }
    } catch (e) {
      // Abaikan token tidak valid pada rute publik
    }
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  JWT_SECRET,
};
