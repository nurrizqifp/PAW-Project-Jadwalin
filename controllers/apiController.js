const { z } = require('zod');
const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const aiSolverService = require('../services/aiSolverService');
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

exports.generate = async (req, res) => {
  try {
    const hasCustomPayload = req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0;
    const solverOutput = await aiSolverService.generateSchedule({
      payload: hasCustomPayload ? req.body : undefined
    });
    const baseResult = JadwalModel.generateAI();
    const totalKonflik = solverOutput.konflik.length;
    const status = totalKonflik === 0 ? 'Terpublikasi' : 'Generated (Konflik)';

    const result = {
      ...baseResult,
      success: solverOutput.sukses,
      source: solverOutput.source,
      model: solverOutput.model,
      fallbackReason: solverOutput.fallbackReason,
      message: solverOutput.source === 'gemini-api'
        ? `Jadwal berhasil dioptimasi oleh Gemini AI (${solverOutput.model}) dalam ${solverOutput.evaluasi.durasiGenerateDetik} detik (${totalKonflik} bentrok).`
        : `Jadwal dioptimasi menggunakan solver lokal (${totalKonflik} bentrok).`,
      totalKonflik,
      daftarKonflik: solverOutput.konflik,
      labMatching: `${solverOutput.evaluasi.persenLabMatching}% Sesuai`,
      kepuasanDosen: `${solverOutput.evaluasi.persenPreferensiDosenTerpenuhi}%`,
      status,
      evaluasi: solverOutput.evaluasi,
      jadwal: solverOutput.jadwal,
      timestamp: solverOutput.timestamp
    };

    return res.json({
      sukses: true,
      result,
      notifikasi: JadwalModel.getNotifikasi()
    });
  } catch (err) {
    return res.status(500).json({
      sukses: false,
      pesan: 'Gagal menjalankan AI Solver: ' + err.message
    });
  }
};

exports.backupPostgres = (req, res) => {
  const dosens = MasterModel.getDosen();
  const matkuls = MasterModel.getMatkulForMahasiswa(5, 'ALL') || [];
  const ruangans = MasterModel.getRuangan();
  const jadwals = JadwalModel.getAll();
  const constraints = ConstraintModel.getAll();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  let sqlDump = `-- ====================================================================\n`;
  sqlDump += `-- Jadwalin PostgreSQL Database Backup Dump\n`;
  sqlDump += `-- Database: jadwalin_db | Generated: ${new Date().toISOString()}\n`;
  sqlDump += `-- Engine: PostgreSQL 16 Relational Schema\n`;
  sqlDump += `-- ====================================================================\n\n`;
  sqlDump += `BEGIN;\n\n`;

  // 1. Dosen
  sqlDump += `-- Table: dosens\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS dosens (\n`;
  sqlDump += `  id SERIAL PRIMARY KEY,\n`;
  sqlDump += `  nama VARCHAR(150) NOT NULL,\n`;
  sqlDump += `  inisial VARCHAR(10),\n`;
  sqlDump += `  nidn VARCHAR(30),\n`;
  sqlDump += `  keahlian VARCHAR(150),\n`;
  sqlDump += `  beban_sks INTEGER DEFAULT 12,\n`;
  sqlDump += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n`;
  sqlDump += `);\n\n`;

  dosens.forEach(d => {
    const namaSafe = (d.nama || '').replace(/'/g, "''");
    const keahlianSafe = (d.keahlian || '').replace(/'/g, "''");
    sqlDump += `INSERT INTO dosens (nama, inisial, nidn, keahlian, beban_sks) VALUES ('${namaSafe}', '${d.inisial || ''}', '${d.nidn || ''}', '${keahlianSafe}', ${d.bebanSks || 12});\n`;
  });

  // 2. Ruangan
  sqlDump += `\n-- Table: ruangans\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS ruangans (\n`;
  sqlDump += `  id SERIAL PRIMARY KEY,\n`;
  sqlDump += `  kode VARCHAR(30) NOT NULL UNIQUE,\n`;
  sqlDump += `  nama VARCHAR(150) NOT NULL,\n`;
  sqlDump += `  gedung VARCHAR(10),\n`;
  sqlDump += `  kapasitas INTEGER DEFAULT 40,\n`;
  sqlDump += `  tipe VARCHAR(50)\n`;
  sqlDump += `);\n\n`;

  ruangans.forEach(r => {
    const namaSafe = (r.nama || '').replace(/'/g, "''");
    sqlDump += `INSERT INTO ruangans (kode, nama, gedung, kapasitas, tipe) VALUES ('${r.kode}', '${namaSafe}', '${r.gedung || 'F4'}', ${r.kapasitas || 40}, '${r.tipe || 'Reguler'}') ON CONFLICT (kode) DO NOTHING;\n`;
  });

  // 3. Jadwal Perkuliahan
  sqlDump += `\n-- Table: jadwal_sesis\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS jadwal_sesis (\n`;
  sqlDump += `  id SERIAL PRIMARY KEY,\n`;
  sqlDump += `  kode_matkul VARCHAR(20),\n`;
  sqlDump += `  mata_kuliah VARCHAR(150) NOT NULL,\n`;
  sqlDump += `  kelas VARCHAR(10),\n`;
  sqlDump += `  sks INTEGER DEFAULT 3,\n`;
  sqlDump += `  dosen VARCHAR(150),\n`;
  sqlDump += `  ruang VARCHAR(50),\n`;
  sqlDump += `  hari VARCHAR(20),\n`;
  sqlDump += `  jam_mulai VARCHAR(10),\n`;
  sqlDump += `  jam_selesai VARCHAR(10),\n`;
  sqlDump += `  jenis VARCHAR(30)\n`;
  sqlDump += `);\n\n`;

  jadwals.forEach(j => {
    const mkSafe = (j.mataKuliah || '').replace(/'/g, "''");
    const dosenSafe = (j.dosen || '').replace(/'/g, "''");
    sqlDump += `INSERT INTO jadwal_sesis (kode_matkul, mata_kuliah, kelas, sks, dosen, ruang, hari, jam_mulai, jam_selesai, jenis) VALUES ('${j.kodeMatkul || 'TI261'}', '${mkSafe}', '${j.kelas}', ${j.sks}, '${dosenSafe}', '${j.ruang}', '${j.hari}', '${j.jamMulai}', '${j.jamSelesai}', '${j.jenis}');\n`;
  });

  sqlDump += `\nCOMMIT;\n`;

  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', `attachment; filename="jadwalin_postgres_backup_${timestamp}.sql"`);
  return res.send(sqlDump);
};
