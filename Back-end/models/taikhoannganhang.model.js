const bcrypt = require('bcryptjs');
const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from taikhoannganhang';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from taikhoannganhang where id = ${id}`;
    return db.load(sql);
  },

  getInfoById: id => {
    const sql = `select kh.email as email, kh.hoTen as hoTen
                  from taikhoannganhang tk inner join khachhang kh 
                  on tk.idKhachHang = kh.id where tk.id = ${id}`;
    return db.load(sql);
  },

  loadBySoTK: soTK => {
    const sql = `select tk.id, kh.hoTen from taikhoannganhang tk
                inner join khachhang kh on tk.idKhachHang = kh.id
                where soTK = ${soTK}`;
    return db.load(sql);
  },

  add: entity => {
    const hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash;
    return db.add(entity, 'taikhoannganhang')
  },
  del: id => db.del({ id: id }, 'taikhoannganhang'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'taikhoannganhang')
  },
};
