const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from thietlapnguoinhan';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from thietlapnguoinhan where id = ${id}`;
    return db.load(sql);
  },

  getInfoThiepLapByUserId: id => {
    const sql = `SELECT tk.soTK, kh.hoTen 
                FROM thietlapnguoinhan tl INNER JOIN taikhoannganhang tk
                ON tl.soTaiKhoanNhan = tk.soTK
                INNER JOIN khachhang kh ON kh.id = tk.idKhachHang
                WHERE tl.idTaiKhoanNHGui = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'thietlapnguoinhan'),
  del: id => db.del({ id: id }, 'thietlapnguoinhan'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'thietlapnguoinhan')
  },
};
