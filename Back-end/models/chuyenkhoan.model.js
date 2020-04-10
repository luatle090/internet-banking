const db = require('../utils/db');

module.exports = {
  // all: () => {
  //   const sql = 'select * from lichsuchuyenkhoan';
  //   return db.load(sql);
  // },

  chuyenKhoanNoiBo: (userId, entity, ngayCK) => {

    const sql = `CALL ChuyenKhoanNoiBo(?,?,?,?,?,@status); select @status as status`;
    var param = [userId, entity.userIdNhan, entity.giaoDich, ngayCK, entity.noiDung];
    return db.store(sql, param);
  },

  NopTienVaoTaiKhoan: (entity, ngayCK) => {
    const sql = `CALL NopTien(?,?,?,?,?,?,?,@status); select @status as status`;
    var param = [entity.soTKGui, entity.soTKNhan, entity.giaoDich, ngayCK, 
                  entity.noiDung, entity.partnerCode, entity.checksum];
    return db.store(sql, param);
  },

  chuyenKhoanLienNH: (userIdGui, entity, ngayCK) => {
    const sql = `CALL ChuyenKhoanLienNH(?,?,?,?,?,?,?,@status); select @status as status`;
    var param = [userIdGui, entity.soTKNhan, entity.giaoDich, ngayCK, 
                  entity.noiDung, entity.partnerCode, entity.checksum];
    return db.store(sql, param);
  },

  // loadByIdTaiKhoanGuiWithNhacNo: id => {
  //   const sql = `select * from lichsuchuyenkhoan where idTaiKhoanNHGui = ${id} and idNhacNo IS NOT NULL`;
  //   return db.load(sql);
  // },

  // add: entity => db.add(entity, 'lichsuchuyenkhoan'),
  // del: id => db.del({ id: id }, 'lichsuchuyenkhoan'),
  // patch: (id, entity) => {
  //   delete entity.id;
  //   return db.patch(entity, { id: id }, 'lichsuchuyenkhoan')
  // },
};
