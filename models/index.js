const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const UserModel = require('./User');
const DosenModel = require('./Dosen');
const MahasiswaModel = require('./Mahasiswa');
const MataKuliahModel = require('./MataKuliah');
const RuanganModel = require('./Ruangan');
const PeriodeJadwalModel = require('./PeriodeJadwal');
const JadwalSesiModel = require('./JadwalSesi');
const JadwalDosenModel = require('./JadwalDosen');
const ConstraintHardModel = require('./ConstraintHard');
const ConstraintSoftModel = require('./ConstraintSoft');
const NotifikasiModel = require('./Notifikasi');
const KonflikLogModel = require('./KonflikLog');
const MahasiswaPrakrsModel = require('./MahasiswaPrakrs');

// Inisialisasi Model
const User = UserModel(sequelize);
const Dosen = DosenModel(sequelize);
const Mahasiswa = MahasiswaModel(sequelize);
const MahasiswaPrakrs = MahasiswaPrakrsModel(sequelize);
const MataKuliah = MataKuliahModel(sequelize);
const Ruangan = RuanganModel(sequelize);
const PeriodeJadwal = PeriodeJadwalModel(sequelize);
const JadwalSesi = JadwalSesiModel(sequelize);
const JadwalDosen = JadwalDosenModel(sequelize);
const ConstraintHard = ConstraintHardModel(sequelize);
const ConstraintSoft = ConstraintSoftModel(sequelize);
const Notifikasi = NotifikasiModel(sequelize);
const KonflikLog = KonflikLogModel(sequelize);

// Definisi Asosiasi Relasional
// 1. User & Relasi Peran
User.belongsTo(Dosen, { foreignKey: 'ref_id', as: 'dosen', constraints: false });
User.belongsTo(Mahasiswa, { foreignKey: 'ref_id', as: 'mahasiswa', constraints: false });

// 2. Periode & Sesi Jadwal
PeriodeJadwal.hasMany(JadwalSesi, { foreignKey: 'periode_id', as: 'sesi' });
JadwalSesi.belongsTo(PeriodeJadwal, { foreignKey: 'periode_id', as: 'periode' });

// 3. Mata Kuliah & Jadwal Sesi
MataKuliah.hasMany(JadwalSesi, { foreignKey: 'mata_kuliah_id', as: 'sesi' });
JadwalSesi.belongsTo(MataKuliah, { foreignKey: 'mata_kuliah_id', as: 'mataKuliah' });

// 4. Ruangan & Jadwal Sesi
Ruangan.hasMany(JadwalSesi, { foreignKey: 'ruangan_id', as: 'sesi' });
JadwalSesi.belongsTo(Ruangan, { foreignKey: 'ruangan_id', as: 'ruangan' });

// 5. Team Teaching: Many-to-Many JadwalSesi <-> Dosen via JadwalDosen
JadwalSesi.belongsToMany(Dosen, { through: JadwalDosen, foreignKey: 'jadwal_sesi_id', otherKey: 'dosen_id', as: 'dosens' });
Dosen.belongsToMany(JadwalSesi, { through: JadwalDosen, foreignKey: 'dosen_id', otherKey: 'jadwal_sesi_id', as: 'jadwalSesis' });
JadwalSesi.hasMany(JadwalDosen, { foreignKey: 'jadwal_sesi_id', as: 'jadwalDosens' });
JadwalDosen.belongsTo(JadwalSesi, { foreignKey: 'jadwal_sesi_id', as: 'jadwalSesi' });
Dosen.hasMany(JadwalDosen, { foreignKey: 'dosen_id', as: 'jadwalDosens' });
JadwalDosen.belongsTo(Dosen, { foreignKey: 'dosen_id', as: 'dosen' });

// 6. Dosen & Constraint Soft (Preferensi)
Dosen.hasMany(ConstraintSoft, { foreignKey: 'dosen_id', as: 'preferensi' });
ConstraintSoft.belongsTo(Dosen, { foreignKey: 'dosen_id', as: 'dosen' });

// 7. Notifikasi & Konflik Log
PeriodeJadwal.hasMany(Notifikasi, { foreignKey: 'periode_id', as: 'notifikasis' });
Notifikasi.belongsTo(PeriodeJadwal, { foreignKey: 'periode_id', as: 'periode' });
PeriodeJadwal.hasMany(KonflikLog, { foreignKey: 'periode_id', as: 'konflikLogs' });
KonflikLog.belongsTo(PeriodeJadwal, { foreignKey: 'periode_id', as: 'periode' });

// 8. Mahasiswa & Rencana Pra-KRS
Mahasiswa.hasOne(MahasiswaPrakrs, { foreignKey: 'mahasiswa_id', as: 'prakrs' });
MahasiswaPrakrs.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'mahasiswa' });

// Backward compatibility untuk model memori statis
const MasterModel = require('./masterModel');
const JadwalModel = require('./jadwalModel');
const ConstraintModel = require('./constraintModel');

const db = {
  sequelize,
  Sequelize,
  User,
  Dosen,
  Mahasiswa,
  MataKuliah,
  Ruangan,
  PeriodeJadwal,
  JadwalSesi,
  JadwalDosen,
  ConstraintHard,
  ConstraintSoft,
  Notifikasi,
  KonflikLog,
  MahasiswaPrakrs,
  MasterModel,
  JadwalModel,
  ConstraintModel,
};

module.exports = db;
