const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsuchuyenkhoan';
    return db.load(sql);
  },

  chuyenKhoanNoiBo: (userId, entity, ngayCK) => {

    const sql = `CALL ChuyenKhoanNoiBo(?,?,?,?,?,@status); select @status as status`;
    var param = [userId, entity.userIdNhan, entity.giaoDich, ngayCK, entity.noiDung];
    return db.store(sql, param);
  },

  loadByIdTaiKhoanGuiWithNhacNo: id => {
    const sql = `select * from lichsuchuyenkhoan where idTaiKhoanNHGui = ${id} and idNhacNo IS NOT NULL`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'lichsuchuyenkhoan'),
  del: id => db.del({ id: id }, 'lichsuchuyenkhoan'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'lichsuchuyenkhoan')
  },
};
