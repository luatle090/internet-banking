const db = require('../utils/db');

module.exports = {
  getlist: async (tungay,denngay,nganhang,limit,offset) => {
    console.log(tungay)
    let params = [];
    let sql = `select DATE_FORMAT(ls.ngay, "%d/%m/%Y")as ngay, ls.idTaiKhoanNHNhan, ls.soTaiKhoanGui,
              ls.giaoDich,ls.nganHangGui,ls.noiDungNhan,ls.id,signature
              from lichsunhantien ls 
              inner join doitac dt on dt.partnerCode = ls.nganHangGui
              where ls.ngay >= ${tungay ? "'"+tungay+"'" : 'ls.ngay'}
              and ls.ngay <= ${denngay ?"'"+denngay+"'" : 'ls.ngay'}
              and ls.nganHangGui = ${nganhang ?"'"+nganhang+"'" : 'ls.nganHangGui'}`;
    sql += ` ORDER by ls.ngay desc
              LIMIT ? OFFSET ?`;
    params.push(limit); 
    params.push(offset);

    const countSql = `select count(1) as total
              from lichsunhantien ls 
              inner join doitac dt on dt.partnerCode = ls.nganHangGui
              where ls.ngay >= ${tungay ? "'"+tungay+"'" : 'ls.ngay'}
              and ls.ngay <= ${denngay ?"'"+denngay+"'" : 'ls.ngay'}
              and ls.nganHangGui = ${nganhang ?"'"+nganhang+"'" : 'ls.nganHangGui'}`;
    
    return [await db.select(sql, params), await db.load(countSql)];
  },
  loadByCode: code => {
    const sql = `select * from doitac where partnerCode = ?`;

    return db.select(sql, [code]);
  },

  add: entity => db.add(entity, 'doitac'),
  del: id => db.del({ id: id }, 'doitac'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'doitac')
  },
};
