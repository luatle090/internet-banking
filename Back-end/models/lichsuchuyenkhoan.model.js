const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsuchuyenkhoan';
    return db.load(sql);
  },

  loadByIdTaiKhoanGuiWithOutNhacNo: id => {
    const sql = `select DATE_FORMAT(ngay, "%d/%m/%Y") as ngay, idTaiKhoanNHGui, soTaiKhoanNhan,  
                  giaoDich, noiDungChuyen, nganHangNhan
                  from lichsuchuyenkhoan 
                  where idTaiKhoanNHGui = ${id} and idNhacNo IS NULL
                  order by ngay desc`;
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
