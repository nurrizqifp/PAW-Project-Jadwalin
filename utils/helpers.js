/**
 * Helper utility functions untuk aplikasi Jadwalin
 */

const formatRupiah = (angka) => {
  if (typeof angka !== 'number') return 'Rp 0';
  return 'Rp ' + angka.toLocaleString('id-ID');
};

const formatDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date));
};

const escapeMarkdown = (teks) => {
  return String(teks || '')
    .replace(/\|/g, '%7C')
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 200);
};

const sendResponse = (res, statusCode, success, message, data = null) => {
  const payload = {
    sukses: success,
    pesan: message,
  };
  if (data !== null) {
    payload.data = data;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  formatRupiah,
  formatDate,
  escapeMarkdown,
  sendResponse,
};
