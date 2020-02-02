const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from khachhang';
    return db.load(sql);
  },

  getlist:(email,phone,PageIndex) =>{
    const sql = `CREATE TEMPORARY TABLE IF NOT EXISTS temp AS 
    (
      SELECT ROW_NUMBER() OVER (
          ORDER BY k.id
      ) RowIndex, k.*,t.id as idTK,t.soTK,t.tenDangKy,t.tenGoiNho,t.username,t.password
    FROM khachhang AS k
    LEFT JOIN taikhoannganhang AS t ON k.id = t.idKhachHang
      WHERE ('${email}' = '' OR k.email = '${email}')
      AND ('${phone}' = '' OR k.phone = '${phone}')
    );
    
    SELECT t.*
    FROM temp t
    WHERE t.RowIndex > ((${PageIndex} - 1) * 50)
    AND t.RowIndex <= ${PageIndex} * 50
    ORDER BY t.RowIndex;
    
    DROP TABLE temp;`
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from khachhang where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'khachhang'),
  del: id => db.del({ id: id }, 'khachhang'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'khachhang')
  },
};
