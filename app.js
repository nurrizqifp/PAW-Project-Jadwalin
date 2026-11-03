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
    <body class="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
        <h1 class="text-5xl font-black text-brand-600">404</h1>
        <h2 class="text-xl font-bold text-slate-800 mt-2">Halaman Tidak Ditemukan</h2>
        <p class="text-slate-500 text-sm mt-2">Halaman yang Anda tuju tidak tersedia di sistem Jadwalin.</p>
        <a href="/" class="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Kembali ke Beranda</a>
      </div>
    </body>
    </html>
  `);
});

// Menjalankan Server
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`  🚀 Aplikasi ${config.appName} Berjalan!`);
  console.log(`  🌐 URL: http://localhost:${config.port}`);
  console.log(`  📊 Mode: ${config.nodeEnv}`);
  console.log(`  📝 Logger aktif di: ${config.logDir}/${config.logFile}`);
  console.log(`====================================================`);
});

module.exports = app;
