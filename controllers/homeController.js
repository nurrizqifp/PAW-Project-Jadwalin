const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.index = (req, res) => {
  const jadwal = JadwalModel.getAll();
  const jadwalStatus = JadwalModel.getStatus();
  const notifikasiList = JadwalModel.getNotifikasi();
  const masterSummary = MasterModel.getSummary();
  const dosenList = MasterModel.getDosen();
  const ruanganList = MasterModel.getRuangan();
  const kurikulumList = MasterModel.getKurikulum();
  const peminatanList = MasterModel.getPeminatan();
  const constraints = ConstraintModel.getAll();
  const produk = ProdukModel.getAll();

  // Default mahasiswa: Semester 5 (memiliki TI501, TI503, TI504 sesuai contoh Lampiran 3 & 4), Peminatan PR
  const defaultMahasiswaMatkul = MasterModel.getMatkulForMahasiswa(5, 'PR');
  const defaultPrakrs = JadwalModel.rekomendasiPraKrs({
    kodeMatkulList: defaultMahasiswaMatkul.map(m => m.kode),
    prefKelas: 'B',
    prefHari: 'Semua',
    prefWaktu: 'Semua',
    variasiIndex: 0
  });

  res.render('index', {
    judul: `${config.appName} — AI Powered Smart Course Scheduling TI UMY`,
    appName: config.appName,
    jadwal,
    jadwalStatus,
    notifikasiList,
    masterSummary,
    dosenList,
    ruanganList,
    kurikulumList,
    peminatanList,
    defaultMahasiswaMatkul,
    defaultPrakrs,
    constraints,
    produk
  });
};
