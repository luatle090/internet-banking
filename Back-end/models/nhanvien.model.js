const db = require('../utils/db');
const bcrypt = require('bcryptjs');
module.exports = {
    all: () => {
        const sql = 'select * from nhanvien';
        return db.load(sql);
    },

    loadById: id => {
        const sql = `select * from nhanvien where id = ${id}`;
        return db.load(sql);
    },

     add: entity => {
      const hash = bcrypt.hashSync(entity.password, 8);
      entity.password = hash;
      return db.add(entity, 'nhanvien')
    },
    del: id => db.del({ id: id }, 'nhanvien'),
    patch: (id, entity) => {
        delete entity.id;
        return db.patch(entity, { id: id }, 'nhanvien')
    },
    getlist:(email,hoten,username,id,PageIndex) =>{
        const sql = `CREATE TEMPORARY TABLE IF NOT EXISTS temp AS 
        (
          SELECT ROW_NUMBER() OVER (
              ORDER BY nv.id
          ) RowIndex, nv.*
        FROM nhanvien AS nv
          WHERE ('${email}' = '' OR nv.email = '${email}')
          AND ('${hoten}' = '' OR nv.hoTen = '${hoten}')
          AND ('${username}' = '' OR nv.username = '${username}')
          AND ('${id}' = '' OR nv.id = '${id}')
        );
    
        SELECT t.*
        FROM temp t
        WHERE t.RowIndex > ((${PageIndex} - 1) * 30)
        AND t.RowIndex <= ${PageIndex} * 30
        ORDER BY t.RowIndex;
        DROP TABLE temp;`
        return db.load(sql);
      },
    
};
