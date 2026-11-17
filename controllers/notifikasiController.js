/**
 * controllers/notifikasiController.js
 * Controller Notifikasi (PRD F-08)
 *   GET /api/notifikasi            - notifikasi milik pengguna yang login (drawer)
 *   PUT /api/notifikasi/read-all   - tandai semua notifikasi pengguna sebagai dibaca
 *   PUT /api/notifikasi/:id/read   - tandai satu notifikasi sebagai dibaca
 */
const { z } = require('zod');
const notifikasiService = require('../services/notifikasiService');

const querySchema = z.object({
  belumDibaca: z
    .enum(['1', 'true', '0', 'false'])
    .transform((v) => v === '1' || v === 'true')
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  periodeId: z.coerce.number().int().positive().optional(),
});

exports.daftar = async (req, res, next) => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ sukses: false, pesan: 'Parameter notifikasi tidak valid.' });
    }

    const hasil = await notifikasiService.daftarUntukPengguna({
      pengguna: req.user,
      belumDibaca: parsed.data.belumDibaca,
      limit: parsed.data.limit,
      periodeId: parsed.data.periodeId,
    });

    return res.json({ sukses: true, jumlah: hasil.data.length, belumDibaca: hasil.belumDibaca, data: hasil.data });
  } catch (err) {
    return next(err);
  }
};

exports.tandaiSemuaDibaca = async (req, res, next) => {
  try {
    const jumlah = await notifikasiService.tandaiSemuaDibaca({ pengguna: req.user });
    return res.json({ sukses: true, pesan: `${jumlah} notifikasi ditandai sudah dibaca.`, jumlah });
  } catch (err) {
    return next(err);
  }
};

exports.tandaiDibaca = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ sukses: false, pesan: 'ID notifikasi tidak valid.' });
    }
    const jumlah = await notifikasiService.tandaiDibaca({ pengguna: req.user, id });
    if (jumlah === 0) {
      return res.status(404).json({ sukses: false, pesan: 'Notifikasi tidak ditemukan.' });
    }
    return res.json({ sukses: true, pesan: 'Notifikasi ditandai sudah dibaca.' });
  } catch (err) {
    return next(err);
  }
};