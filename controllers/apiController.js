const { z } = require('zod');
const { Dosen, MataKuliah, Ruangan, Mahasiswa } = require('../models');
const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
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
  inisial: z.string().trim().min(1).max(10).optional(),
  nidn: z.string().trim().min(6).max(30).optional(),
  nama: z.string().trim().min(3, 'Nama dosen wajib diisi (min 3 karakter)').max(150),
  keahlian: z.string().trim().min(3, 'Bidang keahlian wajib diisi (min 3 karakter)').max(255),
  bebanSks: z.coerce.number().int().min(1).max(60).optional()
});

const masterMatkulSchema = z.object({
  kategori: z.literal('matkul'),
  kode: z.string().trim().min(3, 'Kode mata kuliah wajib diisi (min 3 karakter)').max(20),
  nama: z.string().trim().min(3, 'Nama mata kuliah wajib diisi (min 3 karakter)').max(150),
  sks: z.coerce.number().int().min(1).max(6),
  semester: z.coerce.number().int().min(1).max(8),
  jenis: z.enum(['Teori', 'Praktikum']).optional().default('Teori'),
  kategoriMK: z.string().optional(),
  kodePeminatan: z.string().optional()
});

const masterRuanganSchema = z.object({
  kategori: z.literal('ruangan'),
  kode: z.string().trim().min(2, 'Kode ruang wajib diisi (min 2 karakter)').max(25),
  nama: z.string().trim().min(3, 'Nama ruang wajib diisi (min 3 karakter)').max(100),
  gedung: z.string().optional(),
  kapasitas: z.coerce.number().int().min(10).max(200),
  tipe: z.enum(['Laboratorium', 'Ruang Kuliah Besar', 'Ruang Kuliah', 'Reguler']).optional().default('Ruang Kuliah')
});

const masterMahasiswaSchema = z.object({
  kategori: z.literal('mahasiswa'),
  nim: z.string().trim().min(8, 'NIM minimal 8 digit').max(20),
  nama: z.string().trim().min(3, 'Nama mahasiswa wajib diisi (min 3 karakter)').max(150),
  angkatan: z.coerce.number().int().min(2018).max(2030),
  semesterAktif: z.coerce.number().int().min(1).max(14),
  kodePeminatan: z.string().optional()
});

const masterInputSchema = z.discriminatedUnion('kategori', [
  masterDosenSchema,
  masterMatkulSchema,
  masterRuanganSchema,
  masterMahasiswaSchema
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
    deskripsi: 'AI Powered Smart Course Scheduling System - TI UMY',
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

exports.master = async (req, res) => {
  const { semester, peminatan } = req.query;

  try {
    // Ambil data riil dari Sequelize (PostgreSQL)
    const [dbDosen, dbRuangan, dbMatkul, dbMhs] = await Promise.all([
      Dosen.findAll({ order: [['id', 'ASC']] }),
      Ruangan.findAll({ order: [['id', 'ASC']] }),
      MataKuliah.findAll({ order: [['semester', 'ASC'], ['kode', 'ASC']] }),
      Mahasiswa.findAll({ order: [['nim', 'ASC']] }),
    ]);

    if (dbDosen && dbDosen.length > 0) {
      const kurikulumFiltered = semester ? dbMatkul.filter(m => m.semester === Number(semester)) : dbMatkul;
      return res.json({
        sukses: true,
        sumberData: 'database_postgresql',
        summary: {
          totalDosen: dbDosen.length,
          totalMatkul: dbMatkul.length,
          totalRuangan: dbRuangan.length,
          totalMahasiswa: dbMhs.length,
          ruangF6: dbRuangan.filter(r => (r.gedung || '').includes('F6')).length,
          ruangF4: dbRuangan.filter(r => (r.gedung || '').includes('F4')).length,
        },
        dosen: dbDosen,
        ruangan: dbRuangan,
        mataKuliah: dbMatkul,
        kurikulum: kurikulumFiltered,
        mahasiswa: dbMhs,
      });
    }
  } catch (err) {
    // Database offline atau belum dimigrasi, gunakan fallback model memori statis
  }

  // Fallback ke model memori statis
  return res.json({
    sukses: true,
    sumberData: 'memori_statis',
    summary: MasterModel.getSummary(),
    dosen: MasterModel.getDosen(),
    ruangan: MasterModel.getRuangan(),
    kurikulum: MasterModel.getKurikulum(semester),
    kurikulumMahasiswa: semester ? MasterModel.getMatkulForMahasiswa(semester, peminatan || 'PR') : undefined,
    peminatan: MasterModel.getPeminatan(peminatan),
    mataKuliah: MasterModel.getMataKuliah(),
    mahasiswa: MasterModel.getMahasiswa(),
  });
};

exports.tambahMaster = async (req, res) => {
  const parsed = masterInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Kolom wajib tidak boleh kosong atau format salah.',
      errors: parsed.error.issues,
    });
  }

  const payload = parsed.data;
  let item = null;

  try {
    if (payload.kategori === 'dosen') {
      const inisial = payload.inisial || payload.nama.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
      item = await Dosen.create({
        inisial,
        nidn: payload.nidn || null,
        nama: payload.nama,
        keahlian: payload.keahlian,
        beban_sks_max: payload.bebanSks || 12,
      });
    } else if (payload.kategori === 'matkul') {
      item = await MataKuliah.create({
        kode: payload.kode.toUpperCase(),
        nama: payload.nama,
        sks: payload.sks,
        semester: payload.semester,
        jenis: payload.jenis || 'Teori',
        kategori: payload.kategoriMK || 'Wajib',
        kode_peminatan: payload.kodePeminatan || null,
        semester_penawaran: payload.semester % 2 === 1 ? 'Ganjil' : 'Genap',
      });
    } else if (payload.kategori === 'ruangan') {
      item = await Ruangan.create({
        kode: payload.kode,
        nama: payload.nama,
        gedung: payload.gedung || (payload.kode.startsWith('F6') ? 'Gedung F6' : 'Gedung F4'),
        tipe: payload.tipe === 'Reguler' ? 'Ruang Kuliah' : payload.tipe,
        kapasitas: payload.kapasitas,
      });
    } else if (payload.kategori === 'mahasiswa') {
      item = await Mahasiswa.create({
        nim: payload.nim,
        nama: payload.nama,
        angkatan: payload.angkatan,
        semester_aktif: payload.semesterAktif,
        kode_peminatan: payload.kodePeminatan || null,
      });
    }
  } catch (dbErr) {
    // Fallback jika database offline
  }

  // Sinkronisasi ke model memori
  let memItem = null;
  if (payload.kategori === 'dosen') memItem = MasterModel.addDosen(payload);
  if (payload.kategori === 'matkul') memItem = MasterModel.addMataKuliah(payload);
  if (payload.kategori === 'ruangan') memItem = MasterModel.addRuangan(payload);
  if (payload.kategori === 'mahasiswa') memItem = MasterModel.addMahasiswa(payload);

  return res.status(201).json({
    sukses: true,
    pesan: `Data ${payload.kategori} berhasil ditambahkan.`,
    item: item || memItem || payload,
    summary: MasterModel.getSummary(),
  });
};

exports.updateDosen = async (req, res) => {
  const id = Number(req.params.id);
  const parsed = masterDosenSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input update dosen tidak valid.',
    });
  }

  let dbUpdated = null;
  try {
    const dosen = await Dosen.findByPk(id);
    if (dosen) {
      if (parsed.data.nama) dosen.nama = parsed.data.nama;
      if (parsed.data.inisial) dosen.inisial = parsed.data.inisial;
      if (parsed.data.nidn !== undefined) dosen.nidn = parsed.data.nidn;
      if (parsed.data.keahlian) dosen.keahlian = parsed.data.keahlian;
      if (parsed.data.bebanSks) dosen.beban_sks_max = parsed.data.bebanSks;
      await dosen.save();
      dbUpdated = dosen;
    }
  } catch (e) {}

  const memUpdated = MasterModel.updateDosen(id, parsed.data);
  const result = dbUpdated || memUpdated;

  if (!result) {
    return res.status(404).json({
      sukses: false,
      pesan: `Dosen dengan ID ${id} tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data dosen ${result.nama} berhasil diperbarui.`,
    item: result,
    summary: MasterModel.getSummary(),
  });
};

exports.deleteDosen = async (req, res) => {
  const id = Number(req.params.id);
  let dbSuccess = false;

  try {
    const deleted = await Dosen.destroy({ where: { id } });
    if (deleted > 0) dbSuccess = true;
  } catch (e) {}

  const memSuccess = MasterModel.deleteDosen(id);

  if (!dbSuccess && !memSuccess) {
    return res.status(404).json({
      sukses: false,
      pesan: `Dosen dengan ID ${id} tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data dosen ID ${id} berhasil dihapus.`,
    summary: MasterModel.getSummary(),
  });
};

exports.updateMatkul = async (req, res) => {
  const identifier = req.params.id;
  const parsed = masterMatkulSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input update mata kuliah tidak valid.',
    });
  }

  let dbUpdated = null;
  try {
    const whereClause = isNaN(Number(identifier)) ? { kode: identifier.toUpperCase() } : { id: Number(identifier) };
    const mk = await MataKuliah.findOne({ where: whereClause });
    if (mk) {
      if (parsed.data.nama) mk.nama = parsed.data.nama;
      if (parsed.data.sks) mk.sks = parsed.data.sks;
      if (parsed.data.semester) mk.semester = parsed.data.semester;
      if (parsed.data.jenis) mk.jenis = parsed.data.jenis;
      await mk.save();
      dbUpdated = mk;
    }
  } catch (e) {}

  const memUpdated = MasterModel.updateMataKuliah(identifier, parsed.data);
  const result = dbUpdated || memUpdated;

  if (!result) {
    return res.status(404).json({
      sukses: false,
      pesan: `Mata kuliah '${identifier}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data mata kuliah ${result.nama} berhasil diperbarui.`,
    item: result,
    summary: MasterModel.getSummary(),
  });
};

exports.deleteMatkul = async (req, res) => {
  const identifier = req.params.id;
  let dbSuccess = false;

  try {
    const whereClause = isNaN(Number(identifier)) ? { kode: identifier.toUpperCase() } : { id: Number(identifier) };
    const deleted = await MataKuliah.destroy({ where: whereClause });
    if (deleted > 0) dbSuccess = true;
  } catch (e) {}

  const memSuccess = MasterModel.deleteMataKuliah(identifier);

  if (!dbSuccess && !memSuccess) {
    return res.status(404).json({
      sukses: false,
      pesan: `Mata kuliah '${identifier}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data mata kuliah '${identifier}' berhasil dihapus.`,
    summary: MasterModel.getSummary(),
  });
};

exports.updateRuangan = async (req, res) => {
  const id = req.params.id;
  const parsed = masterRuanganSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input update ruangan tidak valid.',
    });
  }

  let dbUpdated = null;
  try {
    const whereClause = isNaN(Number(id)) ? { kode: id } : { id: Number(id) };
    const ruang = await Ruangan.findOne({ where: whereClause });
    if (ruang) {
      if (parsed.data.nama) ruang.nama = parsed.data.nama;
      if (parsed.data.kode) ruang.kode = parsed.data.kode;
      if (parsed.data.kapasitas) ruang.kapasitas = parsed.data.kapasitas;
      if (parsed.data.gedung) ruang.gedung = parsed.data.gedung;
      if (parsed.data.tipe) ruang.tipe = parsed.data.tipe;
      await ruang.save();
      dbUpdated = ruang;
    }
  } catch (e) {}

  const memUpdated = MasterModel.updateRuangan(id, parsed.data);
  const result = dbUpdated || memUpdated;

  if (!result) {
    return res.status(404).json({
      sukses: false,
      pesan: `Ruangan '${id}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data ruangan ${result.nama} berhasil diperbarui.`,
    item: result,
    summary: MasterModel.getSummary(),
  });
};

exports.deleteRuangan = async (req, res) => {
  const id = req.params.id;
  let dbSuccess = false;

  try {
    const whereClause = isNaN(Number(id)) ? { kode: id } : { id: Number(id) };
    const deleted = await Ruangan.destroy({ where: whereClause });
    if (deleted > 0) dbSuccess = true;
  } catch (e) {}

  const memSuccess = MasterModel.deleteRuangan(id);

  if (!dbSuccess && !memSuccess) {
    return res.status(404).json({
      sukses: false,
      pesan: `Ruangan '${id}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data ruangan '${id}' berhasil dihapus.`,
    summary: MasterModel.getSummary(),
  });
};

exports.updateMahasiswa = async (req, res) => {
  const id = req.params.id;
  const parsed = masterMahasiswaSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      sukses: false,
      pesan: parsed.error.issues[0]?.message || 'Input update mahasiswa tidak valid.',
    });
  }

  let dbUpdated = null;
  try {
    const whereClause = isNaN(Number(id)) ? { nim: id } : { id: Number(id) };
    const mhs = await Mahasiswa.findOne({ where: whereClause });
    if (mhs) {
      if (parsed.data.nama) mhs.nama = parsed.data.nama;
      if (parsed.data.nim) mhs.nim = parsed.data.nim;
      if (parsed.data.angkatan) mhs.angkatan = parsed.data.angkatan;
      if (parsed.data.semesterAktif) mhs.semester_aktif = parsed.data.semesterAktif;
      if (parsed.data.kodePeminatan !== undefined) mhs.kode_peminatan = parsed.data.kodePeminatan;
      await mhs.save();
      dbUpdated = mhs;
    }
  } catch (e) {}

  const memUpdated = MasterModel.updateMahasiswa(id, parsed.data);
  const result = dbUpdated || memUpdated;

  if (!result) {
    return res.status(404).json({
      sukses: false,
      pesan: `Mahasiswa '${id}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data mahasiswa ${result.nama} berhasil diperbarui.`,
    item: result,
    summary: MasterModel.getSummary(),
  });
};

exports.deleteMahasiswa = async (req, res) => {
  const id = req.params.id;
  let dbSuccess = false;

  try {
    const whereClause = isNaN(Number(id)) ? { nim: id } : { id: Number(id) };
    const deleted = await Mahasiswa.destroy({ where: whereClause });
    if (deleted > 0) dbSuccess = true;
  } catch (e) {}

  const memSuccess = MasterModel.deleteMahasiswa(id);

  if (!dbSuccess && !memSuccess) {
    return res.status(404).json({
      sukses: false,
      pesan: `Mahasiswa '${id}' tidak ditemukan.`,
    });
  }

  return res.json({
    sukses: true,
    pesan: `Data mahasiswa '${id}' berhasil dihapus.`,
    summary: MasterModel.getSummary(),
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
    perubahan: `Hari bebas mengajar (${hariOff}) tercatat untuk "${alasan}" dan dipatuhi AI solver.`,
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
