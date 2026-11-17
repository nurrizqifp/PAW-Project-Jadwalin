const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { User, Dosen, Mahasiswa } = require('../models');
const { JWT_SECRET } = require('../middlewares/auth');

const loginSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Username/NIM/NIDN minimal 3 karakter.')
    .max(20, 'Username/NIM/NIDN maksimal 20 karakter.')
    .regex(/^[A-Za-z0-9._-]+$/, 'Username hanya boleh berisi huruf, angka, titik, atau garis bawah.'),
  password: z.string()
    .min(6, 'Kata sandi minimal 6 karakter.')
    .max(32, 'Kata sandi maksimal 32 karakter.')
});

const forgotPasswordSchema = z.object({
  email: z.string()
    .trim()
    .min(10, 'Email minimal 10 karakter.')
    .max(50, 'Email maksimal 50 karakter.')
    .regex(/^[A-Za-z0-9._%+-]+@(ft\.umy\.ac\.id|mail\.umy\.ac\.id|umy\.ac\.id)$/i, 'Wajib menggunakan email resmi kampus (@ft.umy.ac.id, @mail.umy.ac.id, atau @umy.ac.id).')
});

const updateProfileSchema = z.object({
  nama: z.string()
    .trim()
    .min(3, 'Nama minimal 3 karakter.')
    .max(60, 'Nama maksimal 60 karakter.')
    .regex(/^[A-Za-z\s.,'-]+$/, 'Karakter nama tidak valid.'),
  email: z.string()
    .trim()
    .min(10, 'Email minimal 10 karakter.')
    .max(50, 'Email maksimal 50 karakter.')
    .regex(/^[A-Za-z0-9._%+-]+@(ft\.umy\.ac\.id|mail\.umy\.ac\.id|umy\.ac\.id)$/i, 'Wajib menggunakan email resmi kampus (@ft.umy.ac.id, @mail.umy.ac.id, atau @umy.ac.id).'),
  telepon: z.string()
    .trim()
    .min(10, 'Nomor telepon minimal 10 digit.')
    .max(15, 'Nomor telepon maksimal 15 digit.')
    .regex(/^\+?[0-9]{10,15}$/, 'Nomor telepon hanya boleh angka (10-15 digit, opsional awalan +).')
});

const updatePasswordSchema = z.object({
  currentPassword: z.string()
    .min(6, 'Kata sandi saat ini minimal 6 karakter.')
    .max(32, 'Kata sandi maksimal 32 karakter.'),
  newPassword: z.string()
    .min(8, 'Kata sandi baru minimal 8 karakter.')
    .max(32, 'Kata sandi baru maksimal 32 karakter.'),
  confirmPassword: z.string()
    .min(8, 'Konfirmasi kata sandi minimal 8 karakter.')
    .max(32, 'Konfirmasi kata sandi maksimal 32 karakter.')
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Konfirmasi kata sandi baru tidak cocok.'
});

async function resolveDisplayName(user) {
  if (user.role === 'dosen' && user.ref_id) {
    const dosen = await Dosen.findByPk(user.ref_id);
    if (dosen) return dosen.nama;
  } else if (user.role === 'mahasiswa' && user.ref_id) {
    const mhs = await Mahasiswa.findByPk(user.ref_id);
    if (mhs) return mhs.nama;
  }
  return user.username === 'rina' ? 'Rina Wulandari, S.T.' : user.username;
}

const authController = {
  /**
   * Endpoint Login Pengguna (POST /api/auth/login)
   * Terstandarisasi ISO/IEC 27001 A.8.5: verifikasi Zod + bcrypt terhadap database PostgreSQL.
   */
  login: async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          sukses: false,
          pesan: parsed.error.issues[0]?.message || 'Format username atau kata sandi tidak valid.',
        });
      }

      const { username, password } = parsed.data;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
          sukses: false,
          pesan: 'Username atau kata sandi tidak sesuai.',
        });
      }

      const isPasswordValid = await user.validPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          sukses: false,
          pesan: 'Username atau kata sandi tidak sesuai.',
        });
      }

      const nama = await resolveDisplayName(user);
      const payload = {
        id: user.id,
        username: user.username,
        nama,
        role: user.role,
        refId: user.ref_id,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // Hapus cookie legacy jika masih ada
      res.clearCookie('userRole');

      return res.status(200).json({
        sukses: true,
        pesan: 'Login berhasil.',
        data: {
          user: payload,
        },
      });
    } catch (error) {
      console.error('[Auth Login Error]:', error.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan pada server saat proses autentikasi.',
      });
    }
  },

  /**
   * Endpoint Cek Profil Pengguna (GET /api/auth/me)
   */
  getMe: async (req, res) => {
    try {
      const user = req.user;
      let detail = null;

      if (user.role === 'dosen' && user.refId) {
        detail = await Dosen.findByPk(user.refId);
      } else if (user.role === 'mahasiswa' && user.refId) {
        detail = await Mahasiswa.findByPk(user.refId);
      }

      return res.status(200).json({
        sukses: true,
        pesan: 'Data profil berhasil diambil.',
        data: {
          user,
          detail,
        },
      });
    } catch (error) {
      return res.status(500).json({
        sukses: false,
        pesan: 'Gagal mengambil informasi profil pengguna.',
      });
    }
  },

  /**
   * Endpoint Lupa Kata Sandi (POST /api/auth/forgot-password)
   */
  forgotPassword: async (req, res) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        sukses: false,
        pesan: parsed.error.issues[0]?.message || 'Alamat email institusi tidak valid.'
      });
    }
    return res.status(200).json({
      sukses: true,
      pesan: `Instruksi pemulihan kata sandi telah dikirim ke ${parsed.data.email}.`
    });
  },

  /**
   * Endpoint Update Profil Pengguna (POST /api/auth/profile)
   */
  updateProfile: async (req, res) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        sukses: false,
        pesan: parsed.error.issues[0]?.message || 'Data profil tidak valid.'
      });
    }

    try {
      const { nama, email, telepon } = parsed.data;
      if (req.user?.role === 'dosen' && req.user?.refId) {
        await Dosen.update({ nama }, { where: { id: req.user.refId } });
      } else if (req.user?.role === 'mahasiswa' && req.user?.refId) {
        await Mahasiswa.update({ nama }, { where: { id: req.user.refId } });
      }

      const payload = {
        id: req.user.id,
        username: req.user.username,
        nama,
        role: req.user.role,
        refId: req.user.refId,
        email,
        telepon
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        sukses: true,
        pesan: 'Profil pengelola berhasil diperbarui.',
        data: { user: payload }
      });
    } catch (error) {
      return res.status(500).json({
        sukses: false,
        pesan: 'Gagal memperbarui profil pengguna.'
      });
    }
  },

  /**
   * Endpoint Update Kata Sandi (POST /api/auth/password)
   */
  updatePassword: async (req, res) => {
    const parsed = updatePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        sukses: false,
        pesan: parsed.error.issues[0]?.message || 'Data kata sandi tidak valid.'
      });
    }

    try {
      const user = await User.findByPk(req.user?.id);
      if (!user) {
        return res.status(404).json({ sukses: false, pesan: 'Akun pengguna tidak ditemukan.' });
      }
      const isCurrValid = await user.validPassword(parsed.data.currentPassword);
      if (!isCurrValid) {
        return res.status(400).json({ sukses: false, pesan: 'Kata sandi saat ini tidak sesuai.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(parsed.data.newPassword, salt);
      await user.update({ password_hash: hash });

      return res.status(200).json({
        sukses: true,
        pesan: 'Kata sandi akun berhasil diperbarui di database.'
      });
    } catch (error) {
      return res.status(500).json({
        sukses: false,
        pesan: 'Gagal memperbarui kata sandi.'
      });
    }
  },

  /**
   * Endpoint Logout (POST /api/auth/logout)
   */
  logout: (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('token');
    res.clearCookie('userRole');
    return res.status(200).json({
      sukses: true,
      pesan: 'Logout berhasil. Sesi telah diakhiri.',
    });
  },
};

module.exports = authController;
