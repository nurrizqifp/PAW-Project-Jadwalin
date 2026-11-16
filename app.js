const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

// Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares & Security Headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware Logger untuk mencatat semua HTTP Request ke logs/logger.md
app.use(logger);

// Routing Aplikasi
app.use('/', routes);

// 404 Handler untuk route yang tidak terdaftar
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      sukses: false,
      pesan: `Endpoint '${req.originalUrl}' tidak ditemukan.`,
    });
  }
  res.status(404).render('errors/404', {
    judul: '404 — Halaman Tidak Ditemukan · Jadwalin'
  });
});

// Global 500 Error Handler
app.use((err, req, res, next) => {
  console.error('[Jadwalin Server Error]:', err);
  if (req.originalUrl.startsWith('/api')) {
    return res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kendala pemrosesan pada server internal.',
      error: config.nodeEnv === 'development' ? err.message : undefined
    });
  }
  res.status(500).render('errors/500', {
    judul: '500 — Kendala Server · Jadwalin',
    pesanError: config.nodeEnv === 'development' ? err.message : 'Terjadi kendala pada sistem backend.'
  });
});

// Menjalankan Server jika dieksekusi langsung
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[Jadwalin Server] Running on http://localhost:${config.port} (${config.nodeEnv})`);
    console.log(`[Jadwalin Logger] Writing to ${config.logDir}/${config.logFile}`);
  });
}

module.exports = app;
