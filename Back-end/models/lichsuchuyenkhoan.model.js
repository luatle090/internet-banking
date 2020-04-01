const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsuchuyenkhoan';
    return db.load(sql);
  },

  loadByIdTaiKhoanGuiWithOutNhacNo: (idTaiKhoan, limit, offset) => {
    const sql = `select DATE_FORMAT(ngay, "%d/%m/%Y") as ngayCK, idTaiKhoanNHGui, soTaiKhoanNhan,  
                  giaoDich, noiDungChuyen, nganHangNhan
                  from lichsuchuyenkhoan 
                  where idTaiKhoanNHGui = ${idTaiKhoan} and idNhacNo IS NULL
                  order by ngay desc
                  limit ${limit} offset ${offset}`;
    return db.load(sql);
  },

  countByIdTaiKhoanGuiWithOutNhacNo: (idTaiKhoan) => {
    const sql = `select count(id) as total
                  from lichsuchuyenkhoan 
                  where idTaiKhoanNHGui = ${idTaiKhoan} and idNhacNo IS NULL`;
    return db.load(sql);
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
