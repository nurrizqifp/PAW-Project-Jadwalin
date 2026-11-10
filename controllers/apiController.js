const { z } = require('zod');
const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

const preferensiSchema = z.object({
  dosenNama: z.string().trim().min(3, 'Nama dosen wajib diisi').max(120),
  hariOff: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], {
    message: 'Hari bebas mengajar tidak valid'
  }),
  alasan: z.string().trim().min(3, 'Alasan wajib diisi').max(200)
});

const masterDosenSchema = z.object({
  kategori: z.literal('dosen'),
  inisial: z.string().trim().min(1).max(5).optional(),
  nidn: z.string().trim().min(6).max(20).optional(),
  nama: z.string().trim().min(3, 'Nama dosen wajib diisi').max(120),
  keahlian: z.string().trim().min(3, 'Bidang keahlian wajib diisi').max(120),
  bebanSks: z.coerce.number().int().min(1).max(60).optional()
});

const masterMatkulSchema = z.object({
  kategori: z.literal('matkul'),
  kode: z.string().trim().min(3, 'Kode mata kuliah wajib diisi').max(15),
  nama: z.string().trim().min(3, 'Nama mata kuliah wajib diisi').max(120),
  sks: z.coerce.number().int().min(1).max(6),
  semester: z.coerce.number().int().min(1).max(8),
  jenis: z.string().optional()
});

const masterRuanganSchema = z.object({
  kategori: z.literal('ruangan'),
  kode: z.string().trim().min(2, 'Kode ruang wajib diisi').max(25),
  nama: z.string().trim().min(3, 'Nama ruang wajib diisi').max(120),
  gedung: z.enum(['F4', 'F6']).optional(),
  kapasitas: z.coerce.number().int().min(10).max(200),
  tipe: z.string().optional()
});

const masterInputSchema = z.discriminatedUnion('kategori', [
  masterDosenSchema,
  masterMatkulSchema,
  masterRuanganSchema
]);

const hardConstraintSchema = z.object({
  id: z.enum(['HC-01', 'HC-02', 'HC-03']),
  isActive: z.boolean()
});

const revisiJadwalSchema = z.object({
  id: z.coerce.number().int().positive(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']).optional(),
  jamMulai: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/, 'Format jam HH:MM').optional(),
  jamSelesai: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/, 'Format jam HH:MM').optional(),
  ruang: z.string().trim().min(2).max(40).optional()
});

const prakrsSchema = z.object({
  semester: z.coerce.number().int().min(1, 'Semester wajib integer 1-12').max(12, 'Semester wajib integer 1-12'),
  angkatan: z.coerce.number().int().min(2015).max(2030),
  nama: z.string().trim().regex(/^[A-Za-z\s'.]+$/, 'Nama hanya boleh berisi huruf').min(3, 'Nama minimal 3 huruf').max(100),
  nimSuffix: z.string().trim().regex(/^[0-9]{3}$/, 'NIM belakang wajib 3 digit angka'),
  kodeMatkulList: z.array(z.string().trim().min(2)).optional(),
  prefKelas: z.enum(['A', 'B', 'C', 'D', 'E', 'F']).optional(),
  prefHari: z.string().optional(),
  prefWaktu: z.string().optional(),
  variasiIndex: z.coerce.number().int().min(0).max(20).optional()
});

exports.status = (req, res) => {
  const jadwalStatus = JadwalModel.getStatus();
  res.json({
    status: 'ok',
    aplikasi: config.appName,
    deskripsi: 'Smart Course Scheduling System - TI UMY',
    uptimeDetik: Math.round(process.uptime()),
    waktuServer: new Date().toISOString(),
    statusJadwal: jadwalStatus.status,
    totalKonflik: jadwalStatus.totalKonflik,
    daftarKonflik: jadwalStatus.daftarKonflik,
    totalSesi: jadwalStatus.totalSesi,
    zeroClash: jadwalStatus.zeroClashConfirmed,
    environment: config.nodeEnv
  });
};

exports.jadwal = (req, res) => {
  const { dosen, ruang, kelas, hari, semester, peminatan } = req.query;
  const data = JadwalModel.filter({ dosen, ruang, kelas, hari, semester, peminatan });
  const statusInfo = JadwalModel.getStatus();

  res.json({
    sukses: true,
    statusJadwal: statusInfo.status,
    totalKonflik: statusInfo.totalKonflik,
    daftarKonflik: statusInfo.daftarKonflik,
    notifikasi: JadwalModel.getNotifikasi(),
    jumlah: data.length,
    data
  });
};

exports.rekomendasiPrakrs = (req, res) => {
  const parsed = prakrsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input Onboarding / Pra-KRS tidak valid.'
    });
  }

  const { semester, angkatan, nama, nimSuffix, kodeMatkulList, prefKelas, prefHari, prefWaktu, variasiIndex } = parsed.data;
  const nimLengkap = `${angkatan}0140${nimSuffix}`;
  const rekomendasi = JadwalModel.rekomendasiPraKrs({
    kodeMatkulList: kodeMatkulList || MasterModel.getMatkulForMahasiswa(Math.min(semester, 8), 'PR').map(m => m.kode),
    prefKelas: prefKelas || 'B',
    prefHari: prefHari || 'Semua',
    prefWaktu: prefWaktu || 'Semua',
    variasiIndex: variasiIndex || 0
  });

  return res.json({
    sukses: true,
    profil: {
      nama: nama.toUpperCase(),
      nim: nimLengkap,
      semester,
      angkatan
    },
    ...rekomendasi
  });
};

exports.revisiJadwal = (req, res) => {
  const parsed = revisiJadwalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input revisi jadwal tidak valid.'
    });
  }

  const hasil = JadwalModel.updateSesi(parsed.data.id, parsed.data);
  if (!hasil) {
    return res.status(404).json({
      sukses: false,
      pesan: 'Sesi jadwal tidak ditemukan.'
    });
  }

  return res.json({
    sukses: true,
    pesan: hasil.totalKonflik > 0
      ? `Jadwal diperbarui, namun terdeteksi ${hasil.totalKonflik} konflik hard constraint.`
      : 'Jadwal berhasil diperbarui tanpa konflik (0 bentrok).',
    ...hasil,
    notifikasi: JadwalModel.getNotifikasi()
  });
};

exports.publishJadwal = (req, res) => {
  const result = JadwalModel.publish();
  if (!result.success) {
    return res.status(422).json({
      sukses: false,
      pesan: result.message,
      ...result
    });
  }
  return res.json({
    sukses: true,
    pesan: result.message,
    ...result,
    notifikasi: JadwalModel.getNotifikasi()
  });
};

exports.master = (req, res) => {
  const { semester, peminatan } = req.query;
  res.json({
    sukses: true,
    summary: MasterModel.getSummary(),
    dosen: MasterModel.getDosen(),
    ruangan: MasterModel.getRuangan(),
    kurikulum: MasterModel.getKurikulum(semester),
    kurikulumMahasiswa: semester ? MasterModel.getMatkulForMahasiswa(semester, peminatan || 'PR') : undefined,
    peminatan: MasterModel.getPeminatan(peminatan),
    mataKuliah: MasterModel.getMataKuliah()
  });
};

exports.tambahMaster = (req, res) => {
  const parsed = masterInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Kolom wajib tidak boleh kosong atau format salah.'
    });
  }

  const payload = parsed.data;
  let item = null;
  if (payload.kategori === 'dosen') item = MasterModel.addDosen(payload);
  if (payload.kategori === 'matkul') item = MasterModel.addMataKuliah(payload);
  if (payload.kategori === 'ruangan') item = MasterModel.addRuangan(payload);

  return res.status(201).json({
    sukses: true,
    pesan: `Data ${payload.kategori} berhasil ditambahkan.`,
    item,
    summary: MasterModel.getSummary()
  });
};

exports.updateDosen = (req, res) => {
  const id = Number(req.params.id);
  const parsed = masterDosenSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input update dosen tidak valid.'
    });
  }

  const updated = MasterModel.updateDosen(id, parsed.data);
  if (!updated) {
    return res.status(404).json({
      sukses: false,
      pesan: `Dosen dengan ID ${id} tidak ditemukan.`
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data dosen ${updated.nama} berhasil diperbarui.`,
    item: updated,
    summary: MasterModel.getSummary()
  });
};

exports.deleteDosen = (req, res) => {
  const id = Number(req.params.id);
  const success = MasterModel.deleteDosen(id);
  if (!success) {
    return res.status(404).json({
      sukses: false,
      pesan: `Dosen dengan ID ${id} tidak ditemukan.`
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data dosen ID ${id} berhasil dihapus.`,
    summary: MasterModel.getSummary()
  });
};

exports.constraints = (req, res) => {
  res.json({
    sukses: true,
    data: ConstraintModel.getAll()
  });
};

exports.simpanPreferensiDosen = (req, res) => {
  const parsed = preferensiSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Data preferensi dosen tidak valid.'
    });
  }

  const { dosenNama, hariOff, alasan } = parsed.data;
  const softConstraints = ConstraintModel.updateDosenPreference(dosenNama, hariOff, alasan);
  JadwalModel.tambahNotifikasi({
    kodeMatkul: 'PREF-DOSEN',
    mataKuliah: `Preferensi ${dosenNama}`,
    perubahan: `Hari bebas mengajar (${hariOff}) tercatat untuk "${alasan}" dan dipatuhi sistem solver.`,
    targetPersona: 'Dosen & Akademik'
  });

  return res.json({
    sukses: true,
    pesan: `Preferensi hari bebas mengajar (${hariOff}) untuk ${dosenNama} berhasil disimpan.`,
    softConstraints
  });
};

exports.toggleConstraint = (req, res) => {
  const parsed = hardConstraintSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: 'Parameter hard constraint tidak valid.'
    });
  }

  const updated = ConstraintModel.toggleHardConstraint(parsed.data.id, parsed.data.isActive);
  return res.json({
    sukses: true,
    pesan: `Aturan ${updated.nama} diperbarui.`,
    constraint: updated
  });
};

exports.generate = (req, res) => {
  const result = JadwalModel.generateAI();
  res.json({
    sukses: true,
    result,
    notifikasi: JadwalModel.getNotifikasi()
  });
};

exports.produk = (req, res) => {
  const data = ProdukModel.getAll();
  res.json({
    sukses: true,
    jumlah: data.length,
    data
  });
};
