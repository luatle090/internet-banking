const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsunhantien';
    return db.load(sql);
  },

  loadByIdTaiKhoanNhan: id => {
    const sql = `select id, DATE_FORMAT(ngay, "%d/%m/%Y") as ngay, soTaiKhoanGui, giaoDich,
                nganHangGui, noiDungNhan
                from lichsunhantien
                where idTaiKhoanNHNhan = ${id}
                order by ngay desc`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'lichsunhantien'),
  del: id => db.del({ id: id }, 'lichsunhantien'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'lichsunhantien')
  },
};
