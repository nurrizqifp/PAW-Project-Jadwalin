const fs = require('fs');
const path = require('path');
const config = require('../config');
const { escapeMarkdown } = require('../utils/helpers');

const logPath = path.join(config.logDir, config.logFile);

// Siapkan folder logs dan header tabel Markdown sekali saat middleware dimuat
try {
  fs.mkdirSync(config.logDir, { recursive: true });
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(
      logPath,
      '# Log Request HTTP - ' + config.appName + '\n\n' +
      '| Waktu (WIB) | Method | URL | Status | Durasi | IP |\n' +
      '|---|---|---|---|---|---|\n'
    );
  }
} catch (err) {
  console.error('Gagal inisialisasi file log:', err.message);
}

module.exports = (req, res, next) => {
  const mulai = process.hrtime.bigint();

  // Catat log setelah response selesai terkirim
  res.on('finish', () => {
    const durasiMs = Number(process.hrtime.bigint() - mulai) / 1e6;
    const waktuWIB = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '-';

    const baris = `| ${waktuWIB} | ${req.method} | ${escapeMarkdown(req.originalUrl)} | ${res.statusCode} | ${durasiMs.toFixed(1)} ms | ${escapeMarkdown(ip)} |\n`;

    fs.appendFile(logPath, baris, (err) => {
      if (err) console.error('Gagal menulis ke file log:', err.message);
    });
  });

  next();
};
