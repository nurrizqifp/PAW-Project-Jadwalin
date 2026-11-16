'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dosens = [
      { id: 1, inisial: 'AS', nidn: '0512087201', nama: 'Ir. Asroni, S.T., M.Eng', keahlian: 'Rekayasa Web & Komputasi', beban_sks_max: 12 },
      { id: 2, inisial: 'DP', nidn: '0528096801', nama: 'Dr. Ir. Dwijoko Purbohadi, M.T.', keahlian: 'Arsitektur Perangkat Lunak', beban_sks_max: 19 },
      { id: 3, inisial: 'EP', nidn: '0515037501', nama: 'Ir. Eko Prasetyo, M.Eng., Ph.D.', keahlian: 'Jaringan Komputer & Cyber Security', beban_sks_max: 19 },
      { id: 4, inisial: 'HQ', nidn: '0520019201', nama: 'Muhammad Abdul Haq, S.Tr.T., M.Eng. Ph.D.', keahlian: 'Kecerdasan Buatan & Data Science', beban_sks_max: 24 },
      { id: 5, inisial: 'WS', nidn: '0514117801', nama: 'Winny Setyonugroho, S.Ked., MT., Ph.D', keahlian: 'Sistem Informasi Akademik', beban_sks_max: 12 },
      { id: 6, inisial: 'HS', nidn: '0506048501', nama: 'Haris Setyawan, S.T., M.Eng.', keahlian: 'Pemrograman Bergerak & IoT', beban_sks_max: 25 },
      { id: 7, inisial: 'AK', nidn: '0524048701', nama: 'Aprilia Kurnianti, ST. M. Eng.', keahlian: 'Basis Data Lanjut', beban_sks_max: 16 },
      { id: 8, inisial: 'AG', nidn: '0517088901', nama: 'Dr. Nasy’an Taufiq Al Ghifari, S.T., M.T.', keahlian: 'Cloud Computing & DevOps', beban_sks_max: 18 },
      { id: 9, inisial: 'RG', nidn: '0529019001', nama: 'Dr. Reza Giga Isnanda, S.T., M.Sc.', keahlian: 'UI/UX & Human Computer Interaction', beban_sks_max: 18 },
      { id: 10, inisial: 'CO', nidn: '0511108201', nama: 'Chayadi Oktomy N S, S.T., M.Eng., Ph.D.', keahlian: 'Sistem Operasi & Tata Kelola', beban_sks_max: 12 },
      { id: 11, inisial: 'QA', nidn: '0503069101', nama: 'Qodri Aziz, S.Kom., M.Eng', keahlian: 'Machine Learning & Web Service', beban_sks_max: 19 },
      { id: 12, inisial: 'FF', nidn: '0522079401', nama: 'Muhammad Fadilah Alfarizy, B.Sc., M.Sc.', keahlian: 'Internet of Things', beban_sks_max: 19 },
      { id: 13, inisial: 'NA', nidn: '0505128601', nama: 'Nurwahyu Alamsyah, S.Kom., M.Kom., M.IM., Ph.D', keahlian: 'Jaringan Nirkabel & Sensor', beban_sks_max: 15 },
      { id: 14, inisial: 'AM', nidn: '0518039301', nama: 'Ahmad Musthafa Masyhur, S,Kom. PhD (Cand)', keahlian: 'Keamanan Jaringan', beban_sks_max: 12 },
      { id: 15, inisial: 'AL', nidn: '0509099501', nama: 'Laila Ma’rifatul Azizah, S.Kom., M.I.M.', keahlian: 'Pemrosesan Bahasa Alami', beban_sks_max: 6 },
      { id: 16, inisial: 'TA', nidn: '0514028401', nama: 'Tri Andi, S.T., M.Kom.', keahlian: 'Rekayasa Perangkat Lunak', beban_sks_max: 21 },
      { id: 17, inisial: 'CD', nidn: '0530088801', nama: 'Cahya Damarjati, S.T. M. Eng., Ph.D.', keahlian: 'Interaksi Komputer Manusia', beban_sks_max: 12 },
      { id: 18, inisial: 'EI', nidn: '0516057901', nama: 'Dr. Etik Irijanti, S.T., M.Sc.', keahlian: 'Technopreneurship & Inovasi', beban_sks_max: 10 },
      { id: 19, inisial: 'SR', nidn: '0501017001', nama: 'Prof. Ir. Slamet Riyadi, S.T., M.Sc., Ph.D.', keahlian: 'Visi Komputer & Data', beban_sks_max: 9 },
      { id: 20, inisial: 'AD', nidn: '0512119301', nama: 'Annisa Divayu Andriyani, S,Kom. PhD (Cand)', keahlian: 'Analisis & Desain Sistem', beban_sks_max: 15 },
      { id: 21, inisial: 'TW', nidn: '0504038101', nama: 'Titis Wisnu Wijaya, S. Pd., M. Pd.', keahlian: 'Bahasa Inggris untuk TI', beban_sks_max: 44 },
    ].map(d => ({
      ...d,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('dosens', dosens, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dosens', null, {});
  },
};
