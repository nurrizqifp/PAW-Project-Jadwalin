const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Panel Administrasi Akademik
 */
exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    ...getBaseData(),
    judul: `Panel Administrasi Akademik — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'dashboard'
  });
};

exports.masterDosen = (req, res) => {
  res.render('admin/master/dosen', {
    ...getBaseData(),
    judul: `Master Data Dosen — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'dosen'
  });
};

exports.masterMatkul = (req, res) => {
  res.render('admin/master/matkul', {
    ...getBaseData(),
    judul: `Master Data Mata Kuliah — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'matkul'
  });
};

exports.masterRuangan = (req, res) => {
  res.render('admin/master/ruangan', {
    ...getBaseData(),
    judul: `Master Data Ruangan & Laboratorium — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'ruangan'
  });
};

exports.masterMahasiswa = (req, res) => {
  res.render('admin/master/mahasiswa', {
    ...getBaseData(),
    judul: `Master Data Mahasiswa — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'mahasiswa'
  });
};

exports.periode = (req, res) => {
  res.render('admin/master/periode', {
    ...getBaseData(),
    judul: `Manajemen Periode & Semester — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'periode'
  });
};

exports.constraints = (req, res) => {
  res.render('admin/constraints/hard', {
    ...getBaseData(),
    judul: `Manajemen Hard Constraints — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'constraints'
  });
};

exports.constraintsSoft = (req, res) => {
  res.render('admin/constraints/soft', {
    ...getBaseData(),
    judul: `Manajemen Soft Constraints — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'constraints'
  });
};

exports.generate = (req, res) => {
  res.render('admin/generate', {
    ...getBaseData(),
    judul: `AI Generator Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'generate'
  });
};

exports.jadwal = (req, res) => {
  res.render('admin/jadwal', {
    ...getBaseData(),
    judul: `Preview & Publikasi Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'jadwal'
  });
};

exports.profil = (req, res) => {
  res.render('admin/profil', {
    ...getBaseData(),
    judul: `Profil Pengelola Akademik — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'profil'
  });
};

exports.settings = (req, res) => {
  res.render('admin/settings', {
    ...getBaseData(),
    judul: `Pengaturan Sistem — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'settings'
  });
};
