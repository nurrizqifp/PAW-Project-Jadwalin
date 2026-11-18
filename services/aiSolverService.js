const { z } = require('zod');
const config = require('../config');
const MasterModel = require('../models/masterModel');
const ConstraintModel = require('../models/constraintModel');
const JadwalModel = require('../models/jadwalModel');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const HARI_VALID = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const DHUHUR_WINDOW = { start: '11:30', end: '12:10' };
const ASHAR_WINDOW = { start: '15:00', end: '15:20' };

const DEFAULT_SLOT_WAKTU = [
  { hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Senin', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Senin', jamMulai: '12:10', jamSelesai: '14:50' },
  { hari: 'Senin', jamMulai: '15:20', jamSelesai: '17:50' },
  { hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Selasa', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Selasa', jamMulai: '12:10', jamSelesai: '14:50' },
  { hari: 'Selasa', jamMulai: '15:20', jamSelesai: '17:50' },
  { hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Rabu', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Rabu', jamMulai: '12:10', jamSelesai: '14:50' },
  { hari: 'Rabu', jamMulai: '15:20', jamSelesai: '17:50' },
  { hari: 'Kamis', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Kamis', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Kamis', jamMulai: '12:10', jamSelesai: '14:50' },
  { hari: 'Kamis', jamMulai: '15:20', jamSelesai: '17:50' },
  { hari: 'Jumat', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Jumat', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Jumat', jamMulai: '12:30', jamSelesai: '14:50' },
  { hari: 'Jumat', jamMulai: '15:20', jamSelesai: '17:50' },
  { hari: 'Sabtu', jamMulai: '07:00', jamSelesai: '08:40' },
  { hari: 'Sabtu', jamMulai: '08:50', jamSelesai: '11:30' },
  { hari: 'Sabtu', jamMulai: '12:10', jamSelesai: '14:50' },
  { hari: 'Sabtu', jamMulai: '15:20', jamSelesai: '17:50' }
];

const timeRegex = /^[0-2][0-9]:[0-5][0-9]$/;

const jadwalItemSchema = z.object({
  kodeMatkul: z.string().trim().min(2),
  mataKuliah: z.string().trim().min(2),
  sks: z.coerce.number().int().min(1).max(6),
  kelas: z.string().trim().min(1).max(10),
  dosenInisial: z.string().trim().min(1),
  ruang: z.string().trim().min(2),
  hari: z.enum(HARI_VALID),
  jamMulai: z.string().regex(timeRegex),
  jamSelesai: z.string().regex(timeRegex),
  jenis: z.string().trim().default('Teori')
});

const geminiOutputSchema = z.object({
  jadwal: z.array(jadwalItemSchema).min(1),
  evaluasi: z.object({
    totalSesi: z.coerce.number().int().nonnegative().optional(),
    pelanggaranHardConstraint: z.coerce.number().int().nonnegative().optional(),
    persenPreferensiDosenTerpenuhi: z.coerce.number().min(0).max(100).optional(),
    persenLabMatching: z.coerce.number().min(0).max(100).optional(),
    durasiGenerateDetik: z.coerce.number().nonnegative().optional()
  }).optional()
});

function keMenit(jamStr) {
  const [h, m] = String(jamStr || '00:00').split(':').map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}

function isTimeOverlap(startA, endA, startB, endB) {
  return keMenit(startA) < keMenit(endB) && keMenit(startB) < keMenit(endA);
}

function splitDosenInisial(raw) {
  return String(raw || '')
    .split(';')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean);
}

function isPraktikumCourse(item) {
  if (!item) return false;
  const kode = String(item.kode || item.kodeMatkul || '').toUpperCase();
  const nama = String(item.mataKuliah || item.nama || '').toLowerCase();
  const jenis = String(item.jenis || '').toLowerCase();
  if (jenis.includes('praktikum') || nama.includes('praktikum')) return true;
  // Mata kuliah kurikulum TI UMY yang menggunakan laboratorium komputer
  if (kode === 'TI303' || kode === 'TI304' || kode === 'TI26303' || kode === 'TI26304') return true;
  return false;
}

function isLabRoom(room) {
  if (!room) return false;
  const tipe = String(room.tipe || '').toLowerCase();
  const kode = String(room.kode || '').toLowerCase();
  return tipe.includes('laboratorium') || tipe.includes('lab') || kode.includes('lab');
}

/**
 * Menyusun payload konteks terstruktur sesuai format Section 3 docs/AI_GENERATOR_RULES.md.
 */
function buildSolverPayload(overrides = {}) {
  const constraints = ConstraintModel.getAll();
  const softList = overrides.softConstraints || constraints.softConstraints || [];

  const rawDosen = overrides.dosen || MasterModel.getDosen();
  const dosen = rawDosen.map(d => {
    const pref = softList.find(sc => sc.dosenId === d.id || sc.dosenNama === d.nama);
    const entry = {
      id: d.id,
      inisial: d.inisial,
      nama: d.nama,
      keahlian: d.keahlian,
      bebanMax: d.bebanSks ?? d.bebanMax ?? 12
    };
    if (pref?.hariOff) entry.hariOff = pref.hariOff;
    if (pref?.preferensiWaktu) entry.preferensiWaktu = pref.preferensiWaktu;
    return entry;
  });

  const rawRuangan = overrides.ruangan || MasterModel.getRuangan();
  const ruangan = rawRuangan.map(r => ({
    id: r.id,
    kode: r.kode,
    tipe: r.tipe || 'Reguler',
    kapasitas: r.kapasitas || 40
  }));

  let mataKuliah = overrides.mataKuliah;
  if (!mataKuliah) {
    const existingSesi = JadwalModel.getAll();
    if (existingSesi.length > 0) {
      mataKuliah = existingSesi.map(s => ({
        kode: s.kodeMatkul,
        nama: s.mataKuliah,
        sks: s.sks,
        jenis: s.jenis || (isPraktikumCourse(s) ? 'Praktikum' : 'Teori'),
        kelas: s.kelas,
        dosenInisial: s.dosenInisial
      }));
    } else {
      mataKuliah = MasterModel.getMataKuliah().map(m => ({
        kode: m.kode,
        nama: m.nama,
        sks: m.sks,
        jenis: m.jenis || (isPraktikumCourse(m) ? 'Praktikum' : 'Teori'),
        kelas: 'A'
      }));
    }
  }

  return {
    dosen,
    ruangan,
    mataKuliah,
    slotWaktuTersedia: overrides.slotWaktuTersedia || DEFAULT_SLOT_WAKTU
  };
}

/**
 * Membangun prompt deterministik untuk Gemini API berdasarkan docs/AI_GENERATOR_RULES.md.
 */
function buildPrompt(payload) {
  return [
    'Anda adalah engine optimasi penjadwalan kuliah (bukan chatbot).',
    'Susun jadwal kuliah bebas bentrok dalam format JSON ketat tanpa teks atau markdown tambahan.',
    '',
    'ATURAN HARD CONSTRAINTS (NOL TOLERANSI PELANGGARAN):',
    '1. HC-01 Zero Clash Dosen & Team Teaching: Dosen dengan inisial sama (termasuk team teaching yang dipisah tanda ";", misal "DP;QA") tidak boleh mengajar dua sesi yang waktunya tumpang tindih pada hari yang sama.',
    '2. HC-02 Zero Clash Ruangan: Satu ruangan (Gedung F4 & F6) tidak boleh dipakai lebih dari satu sesi pada hari dan rentang jam yang tumpang tindih.',
    '3. HC-03 Jeda Waktu Ibadah Sholat: Rentang 11:30-12:10 WIB (Dhuhur) dan 15:00-15:20 WIB (Ashar) harus bebas dari perkuliahan.',
    '4. Lab Matching (100%): Mata kuliah bertipe "Praktikum" WAJIB ditempatkan di ruangan bertipe "Laboratorium".',
    '5. HC-04 Alokasi Kapasitas & Kelas Gabungan: Mata kuliah dengan kelas gabungan (kolom kelas berisi tanda ";" seperti "A;B;C" atau "D;E;F") menampung gabungan mahasiswa dan WAJIB ditempatkan di ruangan bertipe "Ruang Kuliah Besar" (seperti F6.001 / kapasitas >= 80). Kelas reguler tunggal (contoh kelas "A") prioritaskan di ruang kelas reguler.',
    '',
    'ATURAN SOFT CONSTRAINTS (TARGET TERPENUHI >= 85%):',
    '1. SC-01 Hari Riset Dosen: Hindari menjadwalkan dosen pada field "hariOff" miliknya.',
    '2. SC-02 Preferensi Waktu: Prioritaskan rentang waktu sesuai preferensi dosen (pagi 07:00-12:00 atau siang).',
    '3. SC-03 Distribusi Hari Seimbang: Distribusikan seluruh mata kuliah secara merata ke seluruh hari perkuliahan (Senin s/d Sabtu, target ~18-20 sesi per hari kerja dan ~12 sesi untuk Jumat & Sabtu). Dilarang menumpuk jadwal hanya pada hari Senin dan Selasa.',
    '',
    'DATA MASTER & SLOT TERSEDIA (INPUT):',
    JSON.stringify(payload),
    '',
    'FORMAT OUTPUT JSON WAJIB:',
    '{"jadwal":[{"kodeMatkul":"TI501","mataKuliah":"Pengembangan Aplikasi Web","sks":3,"kelas":"E","dosenInisial":"AS","ruang":"F6.003","hari":"Senin","jamMulai":"08:50","jamSelesai":"11:30","jenis":"Teori"}],"evaluasi":{"totalSesi":1,"pelanggaranHardConstraint":0,"persenPreferensiDosenTerpenuhi":95.0,"persenLabMatching":100.0,"durasiGenerateDetik":1.2}}'
  ].join('\n');
}

function stripMarkdownFences(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

/**
 * Validasi lokal pasca-generate: HC-01, HC-02, HC-03 (Dhuhur & Ashar), Lab Matching, serta metrik SC.
 */
function validateGeneratedSchedule(jadwalList, payload, durationSeconds = 0) {
  const konflik = [];
  const roomByKode = new Map((payload.ruangan || []).map(r => [String(r.kode).toUpperCase(), r]));
  const dosenByInisial = new Map((payload.dosen || []).map(d => [String(d.inisial).toUpperCase(), d]));

  // Inisialisasi status konflik per sesi
  jadwalList.forEach(item => {
    item.isConflict = false;
    item.conflictReasons = [];
  });

  let praktikumCount = 0;
  let labMatchedCount = 0;
  let softEvaluated = 0;
  let softSatisfied = 0;

  for (let i = 0; i < jadwalList.length; i++) {
    const a = jadwalList[i];

    // HC-03: Jeda Ibadah Sholat (Dhuhur 11:30-12:10, Ashar 15:00-15:20)
    if (isTimeOverlap(a.jamMulai, a.jamSelesai, DHUHUR_WINDOW.start, DHUHUR_WINDOW.end)) {
      a.isConflict = true;
      a.conflictReasons.push(`Melanggar jeda ibadah Dhuhur (11:30-12:10) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai}`);
      konflik.push({
        kode: 'HC-03',
        jenis: 'Pelanggaran Jeda Dhuhur',
        sesiId: a.id,
        sesi: `${a.kodeMatkul} (${a.kelas})`,
        deskripsi: `${a.kodeMatkul} (${a.kelas}) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai} melanggar jeda Dhuhur (11:30-12:10).`,
        saran: 'Pindahkan sesi agar selesai <= 11:30 atau mulai >= 12:10.'
      });
    }
    if (isTimeOverlap(a.jamMulai, a.jamSelesai, ASHAR_WINDOW.start, ASHAR_WINDOW.end)) {
      a.isConflict = true;
      a.conflictReasons.push(`Melanggar jeda ibadah Ashar (15:00-15:20) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai}`);
      konflik.push({
        kode: 'HC-03',
        jenis: 'Pelanggaran Jeda Ashar',
        sesiId: a.id,
        sesi: `${a.kodeMatkul} (${a.kelas})`,
        deskripsi: `${a.kodeMatkul} (${a.kelas}) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai} melanggar jeda Ashar (15:00-15:20).`,
        saran: 'Pindahkan sesi agar tidak melewati 15:00-15:20.'
      });
    }

    // Lab Matching 100%
    if (isPraktikumCourse(a)) {
      praktikumCount++;
      const room = roomByKode.get(String(a.ruang).toUpperCase());
      if (isLabRoom(room)) {
        labMatchedCount++;
      } else {
        a.isConflict = true;
        a.conflictReasons.push(`Praktikum di ruangan non-Laboratorium (${a.ruang})`);
        konflik.push({
          kode: 'HC-LAB',
          jenis: 'Ketidakcocokan Ruangan Praktikum',
          sesiId: a.id,
          sesi: `${a.kodeMatkul} (${a.kelas})`,
          deskripsi: `${a.kodeMatkul} (${a.kelas}) bertipe Praktikum namun ditempatkan di ruang ${a.ruang} (non-Laboratorium).`,
          saran: 'Pindahkan sesi praktikum ke ruangan bertipe Laboratorium.'
        });
      }
    }

    // Soft Constraint SC-01 (hariOff)
    for (const inisial of splitDosenInisial(a.dosenInisial)) {
      const dosen = dosenByInisial.get(inisial);
      if (dosen?.hariOff) {
        softEvaluated++;
        if (String(a.hari).toLowerCase() !== String(dosen.hariOff).toLowerCase()) {
          softSatisfied++;
        }
      }
    }

    // Pairwise HC-01 & HC-02
    for (let j = i + 1; j < jadwalList.length; j++) {
      const b = jadwalList[j];
      if (a.hari !== b.hari) continue;
      if (!isTimeOverlap(a.jamMulai, a.jamSelesai, b.jamMulai, b.jamSelesai)) continue;

      const dosenA = splitDosenInisial(a.dosenInisial);
      const dosenB = splitDosenInisial(b.dosenInisial);
      const shared = dosenA.filter(d => dosenB.includes(d));
      if (shared.length > 0) {
        a.isConflict = true;
        b.isConflict = true;
        a.conflictReasons.push(`Bentrok dosen (${shared.join(', ')}) dengan ${b.kodeMatkul} (${b.kelas}) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai}`);
        b.conflictReasons.push(`Bentrok dosen (${shared.join(', ')}) dengan ${a.kodeMatkul} (${a.kelas}) pada ${b.hari} ${b.jamMulai}-${b.jamSelesai}`);
        konflik.push({
          kode: 'HC-01',
          jenis: 'Bentrok Dosen',
          sesiAId: a.id,
          sesiBId: b.id,
          sesiIds: [a.id, b.id],
          deskripsi: `Dosen (${shared.join(', ')}) terjadwal ganda pada ${a.hari} (${a.jamMulai}-${a.jamSelesai}) di ${a.kodeMatkul} (${a.kelas}) dan ${b.kodeMatkul} (${b.kelas}).`,
          saran: `Geser salah satu sesi ke slot waktu lain di hari ${a.hari}.`
        });
      }

      if (String(a.ruang).toUpperCase() === String(b.ruang).toUpperCase()) {
        a.isConflict = true;
        b.isConflict = true;
        a.conflictReasons.push(`Bentrok ruang ${a.ruang} dipakai bersamaan oleh ${b.kodeMatkul} (${b.kelas}) pada ${a.hari} ${a.jamMulai}-${a.jamSelesai}`);
        b.conflictReasons.push(`Bentrok ruang ${b.ruang} dipakai bersamaan oleh ${a.kodeMatkul} (${a.kelas}) pada ${b.hari} ${b.jamMulai}-${b.jamSelesai}`);
        konflik.push({
          kode: 'HC-02',
          jenis: 'Bentrok Ruangan',
          sesiAId: a.id,
          sesiBId: b.id,
          sesiIds: [a.id, b.id],
          deskripsi: `Ruangan ${a.ruang} dipakai bersamaan oleh ${a.kodeMatkul} (${a.kelas}) dan ${b.kodeMatkul} (${b.kelas}) pada ${a.hari}.`,
          saran: 'Pindahkan sesi ke ruangan kosong dengan tipe yang sesuai.'
        });
      }
    }
  }

  const persenLabMatching = praktikumCount === 0
    ? 100
    : Number(((labMatchedCount / praktikumCount) * 100).toFixed(1));
  const persenPreferensiDosenTerpenuhi = softEvaluated === 0
    ? 100
    : Number(((softSatisfied / softEvaluated) * 100).toFixed(1));

  return {
    konflik,
    evaluasi: {
      totalSesi: jadwalList.length,
      pelanggaranHardConstraint: konflik.length,
      persenPreferensiDosenTerpenuhi,
      persenLabMatching,
      durasiGenerateDetik: Number(durationSeconds.toFixed(2))
    }
  };
}

/**
 * Memanggil Gemini API generateContent dengan temperature 0.1 dan responseMimeType application/json.
 */
async function callGeminiApi(prompt, { apiKey, model = config.geminiModel, timeoutMs = 45000 } = {}) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Gemini API HTTP ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const body = await response.json();
    const rawText = body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini API tidak mengembalikan konten jadwal.');
    }

    const parsedJson = JSON.parse(stripMarkdownFences(rawText));
    const validated = geminiOutputSchema.safeParse(parsedJson);
    if (!validated.success) {
      throw new Error(`Format JSON Gemini tidak sesuai skema: ${validated.error.issues[0]?.message || 'invalid schema'}`);
    }

    return validated.data;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Solver deterministik lokal sebagai fallback saat GEMINI_API_KEY tidak tersedia atau API gagal.
 */
function solveDeterministicFallback(payload) {
  const validSlots = (payload.slotWaktuTersedia || DEFAULT_SLOT_WAKTU).filter(slot =>
    !isTimeOverlap(slot.jamMulai, slot.jamSelesai, DHUHUR_WINDOW.start, DHUHUR_WINDOW.end) &&
    !isTimeOverlap(slot.jamMulai, slot.jamSelesai, ASHAR_WINDOW.start, ASHAR_WINDOW.end)
  );
  const labRooms = (payload.ruangan || []).filter(isLabRoom);
  const largeRooms = (payload.ruangan || []).filter(r => !isLabRoom(r) && (r.tipe === 'Ruang Kuliah Besar' || (r.kapasitas || 0) >= 80));
  const standardRooms = (payload.ruangan || []).filter(r => !isLabRoom(r) && r.tipe !== 'Ruang Kuliah Besar' && (r.kapasitas || 0) < 80);
  const regularRooms = (payload.ruangan || []).filter(r => !isLabRoom(r));
  const dosenList = payload.dosen || [];

  // CSP MRV (Most Constrained Variable First):
  // Prioritaskan praktikum (lab terbatas) dan dosen dengan kelas terbanyak
  const dosenLoad = {};
  (payload.mataKuliah || []).forEach(m => {
    const inisials = splitDosenInisial(m.dosenInisial || 'AS');
    inisials.forEach(ini => {
      dosenLoad[ini] = (dosenLoad[ini] || 0) + 1;
    });
  });

  const sortedMataKuliah = [...(payload.mataKuliah || [])].sort((a, b) => {
    const isPrakA = isPraktikumCourse(a) ? 1 : 0;
    const isPrakB = isPraktikumCourse(b) ? 1 : 0;
    if (isPrakA !== isPrakB) return isPrakB - isPrakA;

    const iniA = splitDosenInisial(a.dosenInisial || 'AS');
    const iniB = splitDosenInisial(b.dosenInisial || 'AS');
    const maxLoadA = Math.max(...iniA.map(i => dosenLoad[i] || 0), 0);
    const maxLoadB = Math.max(...iniB.map(i => dosenLoad[i] || 0), 0);
    return maxLoadB - maxLoadA;
  });

  const placed = [];
  const dayTarget = { 'Senin': 20, 'Selasa': 20, 'Rabu': 20, 'Kamis': 20, 'Jumat': 12, 'Sabtu': 12 };

  for (let idx = 0; idx < sortedMataKuliah.length; idx++) {
    const mk = sortedMataKuliah[idx];
    const isPrak = isPraktikumCourse(mk);
    const isCombined = (mk.kelas || '').includes(';') || (mk.kelas || '').split(/[,;]/).length > 1;
    let candidateRooms;
    if (isPrak) {
      candidateRooms = labRooms.length ? labRooms : payload.ruangan;
    } else if (isCombined) {
      candidateRooms = largeRooms.length ? largeRooms : regularRooms;
    } else {
      candidateRooms = standardRooms.length ? [...standardRooms, ...largeRooms] : regularRooms;
    }
    const defaultDosen = mk.dosenInisial || dosenList[idx % Math.max(dosenList.length, 1)]?.inisial || 'AS';
    const dosenInisials = splitDosenInisial(defaultDosen);

    // Hitung beban sesi saat ini per hari untuk Load Balancing antar hari kerja
    const dayCount = { 'Senin': 0, 'Selasa': 0, 'Rabu': 0, 'Kamis': 0, 'Jumat': 0, 'Sabtu': 0 };
    placed.forEach(p => {
      if (dayCount[p.hari] !== undefined) dayCount[p.hari]++;
    });

    // Urutkan slot: SC-01 (hariOff di belakang) -> SC-03 (seimbangkan beban hari) -> Jam Mulai
    const orderedSlots = [...validSlots].sort((a, b) => {
      const aOff = dosenInisials.some(ini => dosenList.find(d => d.inisial === ini)?.hariOff === a.hari) ? 1 : 0;
      const bOff = dosenInisials.some(ini => dosenList.find(d => d.inisial === ini)?.hariOff === b.hari) ? 1 : 0;
      if (aOff !== bOff) return aOff - bOff;

      const aRatio = (dayCount[a.hari] || 0) / (dayTarget[a.hari] || 15);
      const bRatio = (dayCount[b.hari] || 0) / (dayTarget[b.hari] || 15);
      if (Math.abs(aRatio - bRatio) > 0.05) return aRatio - bRatio;

      return a.jamMulai.localeCompare(b.jamMulai);
    });

    let chosen = null;
    for (const slot of orderedSlots) {
      const dosenBusy = placed.some(p =>
        p.hari === slot.hari &&
        isTimeOverlap(p.jamMulai, p.jamSelesai, slot.jamMulai, slot.jamSelesai) &&
        splitDosenInisial(p.dosenInisial).some(d => dosenInisials.includes(d))
      );
      if (dosenBusy) continue;

      const freeRoom = candidateRooms.find(r => !placed.some(p =>
        p.hari === slot.hari &&
        String(p.ruang).toUpperCase() === String(r.kode).toUpperCase() &&
        isTimeOverlap(p.jamMulai, p.jamSelesai, slot.jamMulai, slot.jamSelesai)
      ));
      if (!freeRoom) continue;

      chosen = {
        kodeMatkul: mk.kode,
        mataKuliah: mk.nama,
        sks: Number(mk.sks) || 2,
        kelas: mk.kelas || 'A',
        kelasList: [mk.kelas || 'A'],
        dosenInisial: defaultDosen,
        ruang: freeRoom.kode,
        hari: slot.hari,
        jamMulai: slot.jamMulai,
        jamSelesai: slot.jamSelesai,
        jenis: isPrak ? 'Praktikum' : 'Teori'
      };
      break;
    }

    if (!chosen && orderedSlots.length > 0 && candidateRooms.length > 0) {
      const fallbackSlot = orderedSlots[idx % orderedSlots.length];
      const fallbackRoom = candidateRooms[idx % candidateRooms.length];
      chosen = {
        kodeMatkul: mk.kode,
        mataKuliah: mk.nama,
        sks: Number(mk.sks) || 2,
        kelas: mk.kelas || 'A',
        kelasList: [mk.kelas || 'A'],
        dosenInisial: defaultDosen,
        ruang: fallbackRoom.kode,
        hari: fallbackSlot.hari,
        jamMulai: fallbackSlot.jamMulai,
        jamSelesai: fallbackSlot.jamSelesai,
        jenis: isPrak ? 'Praktikum' : 'Teori'
      };
    }

    if (chosen) placed.push(chosen);
  }

  return placed;
}

/**
 * Orkestrator utama AI Solver: bangun payload -> panggil Gemini API (atau fallback) -> validasi zero-clash.
 */
async function generateSchedule(options = {}) {
  const startedAt = Date.now();
  const payload = buildSolverPayload(options.payload || {});
  const apiKey = options.apiKey ?? config.geminiApiKey;
  const model = options.model ?? config.geminiModel;
  const allowFallback = options.allowFallback !== false;

  let source = 'gemini-api';
  let fallbackReason = null;
  let rawSchedule = [];

  if (apiKey) {
    try {
      const prompt = buildPrompt(payload);
      const geminiResult = await callGeminiApi(prompt, {
        apiKey,
        model,
        timeoutMs: options.timeoutMs
      });
      rawSchedule = geminiResult.jadwal;
    } catch (err) {
      if (!allowFallback) throw err;
      source = 'local-fallback';
      fallbackReason = err.message;
      rawSchedule = solveDeterministicFallback(payload);
    }
  } else {
    if (!allowFallback) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi.');
    }
    source = 'local-fallback';
    fallbackReason = 'GEMINI_API_KEY belum dikonfigurasi pada environment.';
    rawSchedule = solveDeterministicFallback(payload);
  }

  // Pastikan setiap sesi memiliki id dan representasi dosen yang lengkap
  rawSchedule.forEach((item, idx) => {
    if (!item.id) item.id = idx + 1;
    if (!item.dosen && item.dosenInisial) {
      const matchingDosen = (payload.dosen || []).find(x => x.inisial === item.dosenInisial);
      item.dosen = matchingDosen ? matchingDosen.nama : item.dosenInisial;
    }
  });

  const durationSeconds = (Date.now() - startedAt) / 1000;
  const validation = validateGeneratedSchedule(rawSchedule, payload, durationSeconds);

  return {
    sukses: validation.konflik.length === 0,
    source,
    model: source === 'gemini-api' ? model : 'deterministic-fallback',
    fallbackReason,
    jadwal: rawSchedule,
    evaluasi: validation.evaluasi,
    konflik: validation.konflik,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  DEFAULT_SLOT_WAKTU,
  buildSolverPayload,
  buildPrompt,
  validateGeneratedSchedule,
  callGeminiApi,
  solveDeterministicFallback,
  generateSchedule
};
