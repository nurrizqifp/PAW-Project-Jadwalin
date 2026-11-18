'use strict';

const JadwalModel = require('../models/jadwalModel');
const MasterModel = require('../models/masterModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const daftarMahasiswa = [
      {
        id: 1,
        nim: '20240140001',
        nama: 'Andi Pratama',
        semester: 5,
        kodePeminatan: 'SE',
        // Kombinasi kelas bervariasi: A, B, A, C, A, A, B, A
        kelasPerMatkul: {
          TI501: 'A', // Rabu 08:50
          TI502: 'B', // Kamis 08:50
          TI503: 'A', // Senin 13:20
          TI504: 'C', // Selasa 15:30
          TI505: 'A', // Kamis 13:20
          TI506: 'A', // Selasa 07:50
          TI507: 'B', // Sabtu 07:00
          TI508: 'A', // Selasa 13:20
        },
      },
      {
        id: 2,
        nim: '20240140089',
        nama: 'Bima Eka Setiawan',
        semester: 5,
        kodePeminatan: 'NS',
        // Kombinasi kelas bervariasi: C, A, B, A, A, C, A, B
        kelasPerMatkul: {
          TI501: 'C', // Senin 13:20
          TI502: 'A', // Jumat 07:50
          TI503: 'B', // Senin 08:50
          TI504: 'A', // Rabu 13:20
          TI505: 'A', // Kamis 13:20
          TI506: 'C', // Selasa 09:40
          TI507: 'A', // Sabtu 10:40
          TI508: 'B', // Rabu 09:40
        },
      },
      {
        id: 3,
        nim: '20240140056',
        nama: 'Nur Rizqi Febriansyah Putra',
        semester: 5,
        kodePeminatan: 'SE',
        // Kombinasi kelas bervariasi: B, D, C, D, D, B, C, A
        kelasPerMatkul: {
          TI501: 'B', // Rabu 13:20
          TI502: 'D', // Jumat 13:20
          TI503: 'C', // Rabu 08:50
          TI504: 'D', // Jumat 08:50
          TI505: 'D', // Kamis 08:50
          TI506: 'B', // Selasa 13:20
          TI507: 'C', // Sabtu 08:50
          TI508: 'A', // Selasa 13:20 -> fallback slot aman
        },
      },
      {
        id: 4,
        nim: '20240140091',
        nama: 'Resya Glamoda Suhendri',
        semester: 5,
        kodePeminatan: 'NS',
        // Kombinasi kelas bervariasi: A, C, E, B, D, A, D, B
        kelasPerMatkul: {
          TI501: 'A', // Rabu 08:50
          TI502: 'C', // Kamis 16:20
          TI503: 'E', // Selasa 08:50
          TI504: 'B', // Kamis 16:20 -> alternatif
          TI505: 'D', // Kamis 08:50
          TI506: 'A', // Selasa 07:50
          TI507: 'D', // Sabtu 08:50
          TI508: 'B', // Rabu 09:40
        },
      },
      {
        id: 5,
        nim: '20240140075',
        nama: 'Nisrina Hanifah Ramadhani',
        semester: 5,
        kodePeminatan: 'SE',
        // Kombinasi kelas bervariasi: D, B, A, E, A, D, B, C
        kelasPerMatkul: {
          TI501: 'D', // Kamis 13:20
          TI502: 'B', // Kamis 08:50
          TI503: 'A', // Senin 13:20
          TI504: 'E', // Jumat 13:20
          TI505: 'A', // Kamis 13:20
          TI506: 'D', // Senin 08:50
          TI507: 'B', // Sabtu 07:00
          TI508: 'C', // Rabu 13:20
        },
      },
      {
        id: 6,
        nim: '20240140093',
        nama: 'Haidar Yahya Mudhofar',
        semester: 5,
        kodePeminatan: 'NS',
        // Kombinasi kelas bervariasi: B, A, D, C, A, A, A, A
        kelasPerMatkul: {
          TI501: 'B', // Rabu 13:20
          TI502: 'A', // Jumat 07:50
          TI503: 'D', // Selasa 13:20
          TI504: 'C', // Selasa 15:30
          TI505: 'A', // Kamis 13:20
          TI506: 'A', // Selasa 07:50
          TI507: 'A', // Sabtu 10:40
          TI508: 'E', // Rabu 07:50
        },
      },
      {
        id: 7,
        nim: '20240140133',
        nama: 'A. Muh. Fadil Asytar',
        semester: 5,
        kodePeminatan: 'NS',
        // Kombinasi kelas bervariasi: E, E, B, D, D, B, E, D
        kelasPerMatkul: {
          TI501: 'E', // Senin 08:50
          TI502: 'E', // Kamis 13:20
          TI503: 'B', // Senin 08:50
          TI504: 'D', // Jumat 08:50
          TI505: 'D', // Kamis 08:50
          TI506: 'B', // Selasa 13:20
          TI507: 'E', // Sabtu 13:20
          TI508: 'A', // Selasa 13:20
        },
      },
      {
        id: null,
        nim: '20230140001',
        nama: 'Haidar Mahasiswa',
        semester: 5,
        kodePeminatan: 'SE',
        // Kombinasi kelas bervariasi untuk akun dev mock: A, B, A, C, A, A, B, A
        kelasPerMatkul: {
          TI501: 'A',
          TI502: 'B',
          TI503: 'A',
          TI504: 'C',
          TI505: 'A',
          TI506: 'A',
          TI507: 'B',
          TI508: 'A',
        },
      },
    ];

    const records = [];

    for (const mhs of daftarMahasiswa) {
      const matkulList = MasterModel.getMatkulForMahasiswa(mhs.semester, mhs.kodePeminatan).map((m) => m.kode);
      const resRekomendasi = JadwalModel.rekomendasiPraKrs({
        kodeMatkulList: matkulList,
        kelasPerMatkul: mhs.kelasPerMatkul,
      });

      const totalSks = (resRekomendasi.rekomendasiSesi || []).reduce((acc, s) => acc + (Number(s.sks) || 0), 0);

      records.push({
        mahasiswa_id: mhs.id,
        nim: mhs.nim,
        semester: mhs.semester,
        kode_peminatan: mhs.kodePeminatan,
        pref_kelas: 'Campuran',
        kelas_per_matkul: JSON.stringify(mhs.kelasPerMatkul),
        rekomendasi_sesi: JSON.stringify(resRekomendasi.rekomendasiSesi || []),
        total_sks: totalSks,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('mahasiswa_prakrs', records, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mahasiswa_prakrs', null, {});
  },
};
