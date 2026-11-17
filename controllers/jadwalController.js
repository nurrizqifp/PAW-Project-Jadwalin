/**
 * Controller Jadwal (PRD F-05, F-07)
 * GET  /api/jadwal         - daftar jadwal dengan filter dosen, ruang, kelas, hari, semester
 * POST /api/jadwal/revisi  - edit slot cepat + re-check konflik
 * POST /api/jadwal/publish - validasi zero-clash lalu ubah status menjadi Terpublikasi
 * GET  /api/jadwal/versi   - riwayat versi publikasi
 */
const { z } = require('zod');
const jadwalService = require('../services/jadwalService');

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const JAM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

const queryJadwalSchema = z.object({
  dosen: z.string().trim().max(120).optional(),
  ruang: z.string().trim().max(40).optional(),
  kelas: z.string().trim().regex(/^[A-Za-z0-9]{1,5}$/, 'Kelas tidak valid').transform((k) => k.toUpperCase()).optional(),
  hari: z.enum([...HARI, 'Semua'], { message: 'Hari tidak valid' }).optional(),
  semester: z.coerce.number().int().min(1, 'Semester wajib 1-8').max(8, 'Semester wajib 1-8').optional(),
  peminatan: z.string().trim().max(10).optional(),
  periodeId: z.coerce.number().int().positive().optional(),
});

const revisiSchema = z
  .object({
    id: z.coerce.number().int().positive({ message: 'ID sesi wajib diisi' }),
    hari: z.enum(HARI, { message: 'Hari tidak valid' }).optional(),
    jamMulai: z.string().regex(JAM, 'Format jam HH:MM').optional(),
    jamSelesai: z.string().regex(JAM, 'Format jam HH:MM').optional(),
    ruang: z.string().trim().min(2, 'Kode ruang minimal 2 karakter').max(40).optional(),
  })
  .refine((d) => d.hari || d.jamMulai || d.jamSelesai || d.ruang, {
    message: 'Minimal satu perubahan (hari, jamMulai, jamSelesai, atau ruang) wajib diisi.',
  });

const publishSchema = z.object({
  periodeId: z.coerce.number().int().positive().optional(),
});

// Query string kosong (?dosen=) dianggap tidak mengirim filter.
const bersihkanQuery = (query) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => typeof v === 'string' && v.trim() !== ''));

const tanganiError = (err, res, next) => {
  if (err && err.name === 'ServiceError') {
    return res.status(err.status).json({ sukses: false, pesan: err.message, ...err.extra });
  }
  return next(err);
};

exports.daftar = async (req, res, next) => {
  try {
    const parsed = queryJadwalSchema.safeParse(bersihkanQuery(req.query));
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Filter jadwal tidak valid.' });
    }

    const hasil = await jadwalService.daftarJadwal({ filter: parsed.data, pengguna: req.user || null });

    if (!hasil.periode) {
      return res.json({
        sukses: true,
        pesan: 'Belum ada jadwal yang dipublikasikan.',
        statusJadwal: null,
        periode: null,
        totalKonflik: 0,
        daftarKonflik: [],
        jumlah: 0,
        data: [],
      });
    }

    return res.json({
      sukses: true,
      statusJadwal: hasil.periode.status,
      periode: hasil.periode,
      totalKonflik: hasil.totalKonflik,
      daftarKonflik: hasil.daftarKonflik,
      canPublish: hasil.canPublish,
      jumlah: hasil.data.length,
      data: hasil.data,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

exports.revisi = async (req, res, next) => {
  try {
    const parsed = revisiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'Input revisi jadwal tidak valid.' });
    }

    const hasil = await jadwalService.revisiSlot({ ...parsed.data, pengguna: req.user });

    let pesan = 'Tidak ada perubahan pada slot.';
    if (hasil.berubah) {
      pesan =
        hasil.totalKonflik > 0
          ? `Jadwal diperbarui, namun terdeteksi ${hasil.totalKonflik} konflik hard constraint.`
          : 'Jadwal berhasil diperbarui tanpa konflik (0 bentrok).';
    }

    return res.json({
      sukses: true,
      pesan,
      berubah: hasil.berubah,
      sesi: hasil.sesi,
      periode: hasil.periode,
      status: hasil.periode.status,
      totalKonflik: hasil.totalKonflik,
      konflik: hasil.konflik,
      canPublish: hasil.totalKonflik === 0,
      notifikasiDibuat: hasil.notifikasiDibuat,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

exports.publish = async (req, res, next) => {
  try {
    const parsed = publishSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: parsed.error.issues[0]?.message || 'periodeId tidak valid.' });
    }

    const hasil = await jadwalService.publishJadwal({ periodeId: parsed.data.periodeId, pengguna: req.user });

    return res.json({
      sukses: true,
      pesan: `Jadwal perkuliahan berhasil dipublikasikan (${hasil.versi.nomorVersi}) untuk seluruh dosen dan mahasiswa.`,
      status: hasil.periode.status,
      periode: hasil.periode,
      versi: hasil.versi,
      notifikasiDibuat: hasil.notifikasiDibuat,
      timestamp: hasil.timestamp,
    });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};

exports.riwayatVersi = async (req, res, next) => {
  try {
    const parsed = publishSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: 'periodeId tidak valid.' });
    }
    const hasil = await jadwalService.riwayatVersi({ periodeId: parsed.data.periodeId });
    return res.json({ sukses: true, periode: hasil.periode, jumlah: hasil.data.length, data: hasil.data });
  } catch (err) {
    return tanganiError(err, res, next);
  }
};
