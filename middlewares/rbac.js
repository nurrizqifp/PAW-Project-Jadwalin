/**
 * Middleware Role-Based Access Control (RBAC)
 * @param  {...string} roles Peran yang diizinkan (contoh: 'admin', 'dosen', 'mahasiswa')
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({
          sukses: false,
          pesan: 'Akses ditolak. Pengguna belum terautentikasi.',
        });
      }
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(403).json({
          sukses: false,
          pesan: `Akses ditolak. Fitur ini hanya diperuntukkan bagi peran: ${roles.join(', ')}.`,
        });
      }
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>403 - Akses Ditolak</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-zinc-50 min-h-screen flex items-center justify-center p-4">
          <div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 max-w-sm">
            <span class="text-4xl font-bold text-red-600">403</span>
            <h1 class="text-base font-bold text-zinc-800 mt-2">Akses Dilarang</h1>
            <p class="text-zinc-500 text-xs mt-2">Akun Anda (${req.user.role}) tidak memiliki izin mengakses halaman ini.</p>
            <a href="/" class="mt-5 inline-block px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800">Kembali ke Beranda</a>
          </div>
        </body>
        </html>
      `);
    }

    next();
  };
};

module.exports = {
  authorizeRole,
};
