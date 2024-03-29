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

  getAccValidById: id => {
    const sql = `select * from taikhoannganhang where id = ${id} and tinhTrang is true`;
    return db.load(sql);
  },

  getInfoById: id => {
    const sql = `select tk.soTK as soTK, kh.email as email, kh.hoTen as hoTen
                  from taikhoannganhang tk inner join khachhang kh 
                  on tk.idKhachHang = kh.id where tk.id = ${id}`;
    return db.load(sql);
  },

  getInfoBySoTK: soTK => {
    const sql = `select kh.email as email, kh.hoTen as hoTen, kh.phone as phone
                  from taikhoannganhang tk inner join khachhang kh 
                  on tk.idKhachHang = kh.id where tk.soTK = ${soTK}
                  where tk.tinhTrang is true`;
      return db.load(sql);
  },

  loadBySoTK: soTK => {
    const sql = `select tk.id, kh.hoTen, tenDangKy as tenDangKy
                from taikhoannganhang tk
                inner join khachhang kh on tk.idKhachHang = kh.id
                where soTK = ${soTK}`;
    return db.load(sql);
  },

  getInfoNotMeBySoTK: (idTaiKhoan, soTKTruyVan) => {
    const sql = `select tk.id, kh.hoTen, tk.tenDangKy from taikhoannganhang tk
                  inner join khachhang kh on tk.idKhachHang = kh.id
                  where tk.soTK = ${soTKTruyVan}
                  and not exists 
                  (select id from taikhoannganhang
                    where id = tk.id and id = ${idTaiKhoan})`;
    return db.load(sql);
  },

  add: entity => {
    const hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash;
    return db.add(entity, 'taikhoannganhang')
  },
  del: id => db.del({ id: id }, 'taikhoannganhang'),
  patch: (id, entity) => {
    if(entity.password){
      const hash = bcrypt.hashSync(entity.password, 8);
      entity.password = hash;
    }
    delete entity.id;
    return db.patch(entity, { id: id }, 'taikhoannganhang')
  },
};
