const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

// Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>404 - Halaman Tidak Ditemukan</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-zinc-50 min-h-screen flex items-center justify-center p-4">
      <div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 max-w-sm">
        <span class="text-4xl font-bold text-zinc-900">404</span>
        <h1 class="text-base font-bold text-zinc-800 mt-2">Halaman Tidak Ditemukan</h1>
        <p class="text-zinc-500 text-xs mt-2">Halaman yang dituju tidak tersedia pada sistem.</p>
        <a href="/" class="mt-5 inline-block px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800">Kembali ke Beranda</a>
      </div>
    </body>
    </html>
  `);
});

// Menjalankan Server
app.listen(config.port, () => {
  console.log(`[Jadwalin Server] Running on http://localhost:${config.port} (${config.nodeEnv})`);
  console.log(`[Jadwalin Logger] Writing to ${config.logDir}/${config.logFile}`);
});

module.exports = app;
