'use strict';

const masterModel = require('../models/masterModel');
const jadwalModel = require('../models/jadwalModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const kur = masterModel.getKurikulum();
    const pem = masterModel.getPeminatan();
    const rooms = masterModel.getRuangan();
    const dosens = masterModel.getDosen();
    const sessions = jadwalModel.getAll();

    // 1. Seed Periode Default
    const now = new Date();
    await queryInterface.bulkInsert('periode_jadwals', [
      {
        id: 1,
        nama: 'Semester Gasal 2026/2027',
        tahun_akademik: '2026/2027',
        semester_tipe: 'Ganjil',
        status: 'Terpublikasi',
        generated_at: now,
        published_at: now,
        generated_by: 'AI Solver Core (Nur Rizqi / Kelompok 5)',
        created_at: now,
        updated_at: now,
      },
    ]);

    // Lookup Maps
    const mkMap = new Map();
    let mkId = 1;
    kur.forEach(k => {
      mkMap.set(k.kode, mkId);
      mkMap.set('TI26' + k.kode.slice(2), mkId);
      mkId++;
    });
    pem.forEach(p => {
      mkMap.set(p.kode, mkId);
      mkId++;
    });

    const roomMap = new Map();
    rooms.forEach(r => roomMap.set(r.kode, r.id));

    const dosenMap = new Map();
    dosens.forEach(d => dosenMap.set(d.inisial, d.id));

    // 2. Map 111 Sesi Jadwal
    const sesiList = [];
    const pivotDosenList = [];
    let pivotId = 1;

    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i];
      const sesiId = i + 1;
      const mkIdVal = mkMap.get(s.kodeMatkul) || 1;
      const roomIdVal = roomMap.get(s.ruang) || null;

      sesiList.push({
        id: sesiId,
        periode_id: 1,
        mata_kuliah_id: mkIdVal,
        ruangan_id: roomIdVal,
        hari: s.hari,
        jam_mulai: s.jamMulai,
        jam_selesai: s.jamSelesai,
        kelas: s.kelas,
        is_pilihan: Boolean(s.isPilihan),
        is_lab_valid: s.isLabValid !== false,
        melewati_istirahat: Boolean(s.melewatiIstirahat),
        created_at: now,
        updated_at: now,
      });

      // Pivot Team Teaching
      const inisials = (s.dosenInisial || '').split(';').map(x => x.trim()).filter(Boolean);
      const isTeam = inisials.length > 1;

      for (const ini of inisials) {
        const dId = dosenMap.get(ini);
        if (dId) {
          pivotDosenList.push({
            id: pivotId++,
            jadwal_sesi_id: sesiId,
            dosen_id: dId,
            is_team_teaching: isTeam,
            created_at: now,
            updated_at: now,
          });
        }
      }
    }

    await queryInterface.bulkInsert('jadwal_sesis', sesiList, {});
    await queryInterface.bulkInsert('jadwal_dosens', pivotDosenList, {});

    // 3. Seed Notifikasi Awal
    await queryInterface.bulkInsert('notifikasis', [
      {
        id: 1,
        periode_id: 1,
        target_role: 'all',
        target_ref_id: null,
        judul: 'Jadwal Kuliah Semester Gasal 2026/2027 Terpublikasi',
        isi: 'Dataset 111 sesi jadwal kuliah Semester Gasal 2026/2027 telah terpublikasi dengan 0 bentrok dosen dan ruangan.',
        is_read: false,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifikasis', null, {});
    await queryInterface.bulkDelete('jadwal_dosens', null, {});
    await queryInterface.bulkDelete('jadwal_sesis', null, {});
    await queryInterface.bulkDelete('periode_jadwals', null, {});
  },
};
