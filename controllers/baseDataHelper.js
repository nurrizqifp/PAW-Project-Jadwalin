const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const aiSolverService = require('../services/aiSolverService');
const notifikasiService = require('../services/notifikasiService');
const db = require('../models');
const config = require('../config');

let dbAvailableCache = null;
let lastDbCheck = 0;

async function isDatabaseReady() {
  const now = Date.now();
  if (dbAvailableCache !== null && (now - lastDbCheck) < 15000) {
    return dbAvailableCache;
  }
  try {
    await db.sequelize.authenticate();
    dbAvailableCache = true;
  } catch {
    dbAvailableCache = false;
  }
  lastDbCheck = now;
  return dbAvailableCache;
}

/**
 * Helper terpusat untuk mengambil snapshot data dasar sistem.
 * Membaca dari PostgreSQL (Sequelize) jika aktif, dengan fallback otomatis ke model memori.
 * @param {object|null} currentUser Payload JWT pengguna yang sedang login (opsional)
 */
async function getBaseData(currentUser = null) {
  let jadwal = JadwalModel.getAll();
  let jadwalStatus = JadwalModel.getStatus();
  let notifikasiList = JadwalModel.getNotifikasi();
  let notifikasiBelumDibaca = 0;
  let masterSummary = MasterModel.getSummary();
  let dosenList = MasterModel.getDosen();
  let ruanganList = MasterModel.getRuangan();
  let kurikulumList = MasterModel.getKurikulum();
  let peminatanList = MasterModel.getPeminatan();
  let mahasiswaList = [];
  let periodeList = [
    { id: 1, kode: '20261', nama: 'Semester Gasal 2026/2027', tahunAkademik: '2026/2027', semesterTipe: 'Ganjil', status: 'Terpublikasi' }
  ];
  let constraints = ConstraintModel.getAll();
  let dataSource = 'memory-fallback';

  if (await isDatabaseReady()) {
    try {
      const [
        dbDosens,
        dbRuangans,
        dbMatkuls,
        dbMahasiswas,
        dbPeriodes,
        dbSesis,
        dbNotifs,
        dbHards,
        dbSofts
      ] = await Promise.all([
        db.Dosen.findAll({ order: [['id', 'ASC']] }),
        db.Ruangan.findAll({ order: [['id', 'ASC']] }),
        db.MataKuliah.findAll({ order: [['semester', 'ASC'], ['kode', 'ASC']] }),
        db.Mahasiswa.findAll({ order: [['id', 'ASC']] }),
        db.PeriodeJadwal.findAll({ order: [['id', 'DESC']] }),
        db.JadwalSesi.findAll({
          order: [['id', 'ASC']],
          include: [
            { model: db.MataKuliah, as: 'mataKuliah' },
            { model: db.Ruangan, as: 'ruangan' },
            { model: db.Dosen, as: 'dosens' }
          ]
        }),
        db.Notifikasi.findAll({ order: [['id', 'DESC']], limit: 20 }),
        db.ConstraintHard.findAll({ order: [['id', 'ASC']] }),
        db.ConstraintSoft.findAll({ order: [['id', 'ASC']], include: [{ model: db.Dosen, as: 'dosen' }] })
      ]);

      if (dbDosens.length > 0) {
        dosenList = dbDosens.map(d => ({
          id: d.id,
          inisial: d.inisial,
          nidn: d.nidn,
          nama: d.nama,
          keahlian: d.keahlian || '-',
          bebanSks: d.beban_sks_max
        }));
      }

      if (dbRuangans.length > 0) {
        ruanganList = dbRuangans.map(r => ({
          id: r.id,
          kode: r.kode,
          nama: r.nama,
          gedung: r.gedung,
          tipe: r.tipe,
          kapasitas: r.kapasitas
        }));
      }

      if (dbMatkuls.length > 0) {
        kurikulumList = dbMatkuls.filter(m => !m.kode_peminatan).map(m => ({
          id: m.id,
          semester: m.semester,
          kode: m.kode,
          nama: m.nama,
          sks: m.sks,
          kategori: m.kategori || 'Wajib Prodi',
          jenis: m.jenis
        }));
        const dbPem = dbMatkuls.filter(m => m.kode_peminatan).map(m => ({
          id: m.id,
          kode: m.kode,
          nama: m.nama,
          sks: m.sks,
          kodePeminatan: m.kode_peminatan,
          peminatan: m.kategori || m.kode_peminatan,
          semesterPenawaran: m.semester_penawaran || 'Ganjil'
        }));
        if (dbPem.length > 0) peminatanList = dbPem;
      }

      if (dbMahasiswas.length > 0) {
        mahasiswaList = dbMahasiswas.map(m => ({
          id: m.id,
          nim: m.nim,
          nama: m.nama,
          angkatan: m.angkatan,
          semesterAktif: m.semester_aktif,
          kodePeminatan: m.kode_peminatan || 'PR'
        }));
      }

      if (dbSesis.length > 0) {
        jadwal = dbSesis.map(s => {
          const mk = s.mataKuliah;
          const rg = s.ruangan;
          const ds = s.dosens || [];
          return {
            id: s.id,
            kodeMatkul: mk ? mk.kode : '-',
            mataKuliah: mk ? mk.nama : '-',
            sks: mk ? mk.sks : 2,
            semester: mk ? mk.semester : 1,
            jenis: mk ? mk.jenis : 'Teori',
            kelas: s.kelas,
            kelasList: [s.kelas],
            dosenInisial: ds.map(d => d.inisial).join(';') || '-',
            dosen: ds.map(d => d.nama).join(' / ') || '-',
            ruang: rg ? rg.kode : '-',
            gedung: rg ? rg.gedung : (rg && String(rg.kode).startsWith('F4') ? 'F4' : 'F6'),
            tipeRuang: rg ? rg.tipe : 'Ruang Kuliah',
            hari: s.hari,
            jamMulai: s.jam_mulai,
            jamSelesai: s.jam_selesai,
            isPilihan: s.is_pilihan,
            peminatanKode: mk ? mk.kode_peminatan : null,
            isLabValid: s.is_lab_valid
          };
        });

        if (dbPeriodes.length > 0) {
          periodeList = dbPeriodes.map(p => ({
            id: p.id,
            kode: `${String(p.tahun_akademik || '2026').slice(0, 4)}${p.semester_tipe === 'Genap' ? '2' : '1'}`,
            nama: p.nama,
            tahunAkademik: p.tahun_akademik,
            semesterTipe: p.semester_tipe,
            status: p.status,
            publishedAt: p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : '2026-09-01'
          }));
        }
      }

      // Ambil notifikasi sesuai persona pengguna jika login, atau fallback ke seluruh notifikasi
      try {
        if (currentUser && currentUser.role) {
          const userNotifs = await notifikasiService.daftarUntukPengguna({
            pengguna: currentUser,
            limit: 25
          });
          if (userNotifs && userNotifs.data) {
            notifikasiList = userNotifs.data.map(n => ({
              id: n.id,
              kodeMatkul: n.judul,
              mataKuliah: n.targetRole === 'all' ? 'Civitas TI UMY' : n.targetRole.toUpperCase(),
              perubahan: n.isi,
              isRead: n.isRead,
              waktu: n.waktu || 'Terbaru'
            }));
            notifikasiBelumDibaca = userNotifs.belumDibaca || 0;
          }
        } else if (dbNotifs.length > 0) {
          notifikasiList = dbNotifs.map(n => ({
            id: n.id,
            kodeMatkul: n.judul,
            mataKuliah: n.target_role === 'all' ? 'Civitas TI UMY' : n.target_role,
            perubahan: n.isi,
            isRead: n.is_read,
            waktu: n.created_at ? new Date(n.created_at).toLocaleString('id-ID') : 'Terbaru'
          }));
          notifikasiBelumDibaca = dbNotifs.filter(n => !n.is_read).length;
        }
      } catch (eNotif) {
        console.warn('[baseDataHelper] Gagal memuat notifikasi pengguna:', eNotif.message);
      }

      if (dbHards.length > 0 || dbSofts.length > 0) {
        constraints = {
          ...constraints,
          hardConstraints: dbHards.length > 0 ? dbHards.map(h => ({
            dbId: h.id,
            id: h.kode,
            nama: h.nama,
            deskripsi: h.deskripsi,
            isActive: h.is_active,
            status: h.is_active ? 'Wajib Aktif' : 'Nonaktif (Peringatan)'
          })) : constraints.hardConstraints,
          softConstraints: dbSofts.length > 0 ? dbSofts.map(sc => ({
            dbId: sc.id,
            id: sc.kode || `SC-${sc.id}`,
            dosenId: sc.dosen_id,
            dosenNama: sc.dosen ? sc.dosen.nama : `Dosen #${sc.dosen_id}`,
            hariOff: sc.hari_off,
            preferensiWaktu: sc.preferensi_waktu,
            alasan: sc.alasan,
            isAccommodated: sc.is_accommodated,
            status: sc.is_accommodated ? 'Terakomodir' : 'Menunggu'
          })) : constraints.softConstraints
        };
      }

      masterSummary = {
        ...masterSummary,
        totalDosen: dosenList.length,
        totalMatkul: kurikulumList.length + peminatanList.length,
        totalRuangan: ruanganList.length,
        ruangF6: ruanganList.filter(r => r.gedung === 'F6').length,
        ruangF4: ruanganList.filter(r => r.gedung === 'F4').length
      };
      dataSource = 'postgresql';
    } catch (err) {
      console.warn('[BaseDataHelper] Gagal query DB, memakai fallback memori:', err.message);
    }
  }

  const activePeriode = periodeList.find(p => p.status === 'Terpublikasi') || periodeList.find(p => p.status !== 'Arsip') || periodeList[0];
  const todayStr = new Date().toISOString().slice(0, 10);
  const deadlineStr = activePeriode?.publishedAt || '2026-12-31';
  const isExpired = deadlineStr < todayStr;
  const isLockedStatus = (activePeriode?.status || 'Terpublikasi') !== 'Terpublikasi';
  const prakrsAccess = {
    isOpen: !isExpired && !isLockedStatus,
    deadline: deadlineStr,
    statusPeriode: activePeriode?.status || 'Terpublikasi',
    periodeNama: activePeriode?.nama || 'Semester Gasal 2026/2027',
    reason: isLockedStatus
      ? `Periode ${activePeriode?.nama || ''} berstatus ${activePeriode?.status} (akses Pra-KRS dikunci oleh akademik).`
      : (isExpired
        ? `Batas waktu pengisian Pra-KRS (${deadlineStr}) telah berakhir.`
        : `Pengisian Pra-KRS ${activePeriode?.nama || ''} sedang dibuka hingga batas waktu ${deadlineStr}.`)
  };
  const realValidation = aiSolverService.validateGeneratedSchedule(jadwal, { dosen: dosenList, ruangan: ruanganList }, 0);
  jadwalStatus = {
    ...jadwalStatus,
    totalSesi: jadwal.length,
    totalKonflik: realValidation.konflik.length,
    daftarKonflik: realValidation.konflik,
    zeroClashConfirmed: realValidation.konflik.length === 0,
    status: realValidation.konflik.length > 0 ? 'Perlu Revisi (Konflik)' : (activePeriode?.status || 'Terpublikasi')
  };

  // Least Privilege: Hanya muat profil mahasiswa/dosen jika pengguna telah terautentikasi (JWT valid) sesuai peran spesifiknya
  const isAuthenticated = Boolean(currentUser && currentUser.role);
  const activeMahasiswa = (isAuthenticated && currentUser.role === 'mahasiswa')
    ? (mahasiswaList.find(m => m.id === currentUser.refId || m.nim === currentUser.username) || null)
    : null;

  let dbSavedPrakrs = null;
  if (activeMahasiswa && currentUser?.username && (await isDatabaseReady())) {
    try {
      const row = await db.MahasiswaPrakrs.findOne({
        where: { nim: currentUser.username }
      });
      if (row) {
        dbSavedPrakrs = {
          semester: row.semester,
          kodePeminatan: row.kode_peminatan,
          prefKelas: row.pref_kelas,
          kelasPerMatkul: typeof row.kelas_per_matkul === 'string' ? JSON.parse(row.kelas_per_matkul) : row.kelas_per_matkul,
          rekomendasiSesi: typeof row.rekomendasi_sesi === 'string' ? JSON.parse(row.rekomendasi_sesi) : row.rekomendasi_sesi,
          totalSks: row.total_sks
        };
        JadwalModel.setSavedPrakrs(currentUser.username, dbSavedPrakrs);
      }
    } catch (ePrk) {
      console.warn('[baseDataHelper] Gagal membaca mahasiswa_prakrs dari DB:', ePrk.message);
    }
  }

  const rawSavedPrakrs = dbSavedPrakrs || ((activeMahasiswa && currentUser?.username) ? JadwalModel.getSavedPrakrs(currentUser.username) : null);
  const isGanjilActive = (activePeriode?.semesterTipe || 'Ganjil') === 'Ganjil';
  const savedPrakrs = (rawSavedPrakrs && ((Number(rawSavedPrakrs.semester) % 2 === 1) === isGanjilActive))
    ? rawSavedPrakrs
    : null;

  const defaultMahasiswaMatkul = activeMahasiswa
    ? MasterModel.getMatkulForMahasiswa(
        savedPrakrs?.semester || activeMahasiswa.semesterAktif || 5,
        savedPrakrs?.kodePeminatan || activeMahasiswa.kodePeminatan || 'SE'
      )
    : [];
  const defaultPrakrs = activeMahasiswa
    ? (savedPrakrs || JadwalModel.rekomendasiPraKrs({
        kodeMatkulList: defaultMahasiswaMatkul.map(m => m.kode),
        prefKelas: 'B',
        prefHari: 'Semua',
        prefWaktu: 'Semua',
        variasiIndex: 0
      }))
    : { rekomendasiSesi: [], totalSks: 0 };

  const HARI_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const rawHari = HARI_MAP[new Date().getDay()];
  const prakrsSesi = defaultPrakrs.rekomendasiSesi || [];
  let displayHari = rawHari === 'Minggu' ? 'Senin' : rawHari;
  let mahasiswaTodaySessions = prakrsSesi.filter(s => s.hari === displayHari);
  if (mahasiswaTodaySessions.length === 0 && prakrsSesi.length > 0) {
    displayHari = prakrsSesi[0].hari;
    mahasiswaTodaySessions = prakrsSesi.filter(s => s.hari === displayHari);
  }

  const activeDosen = (isAuthenticated && currentUser.role === 'dosen')
    ? (dosenList.find(d => d.id === currentUser.refId || d.nama === currentUser.nama) || null)
    : null;
  const dosenJadwal = activeDosen
    ? jadwal.filter(j =>
        String(j.dosenInisial || '').split(';').map(s => s.trim().toUpperCase()).includes(String(activeDosen.inisial).toUpperCase())
      )
    : [];

  return {
    appName: config.appName,
    appVersion: config.appVersion,
    aiConfigured: Boolean(config.geminiApiKey && !/your_|isi_|example|placeholder|xxxx/i.test(config.geminiApiKey)),
    dataSource,
    jadwal,
    jadwalStatus,
    notifikasiList,
    notifikasiBelumDibaca,
    masterSummary,
    dosenList,
    ruanganList,
    kurikulumList,
    peminatanList,
    mahasiswaList,
    periodeList,
    activePeriode,
    prakrsAccess,
    activeMahasiswa,
    defaultMahasiswaMatkul,
    defaultPrakrs,
    displayHari,
    mahasiswaTodaySessions,
    activeDosen,
    dosenJadwal,
    constraints
  };
}

module.exports = {
  getBaseData,
  config
};
