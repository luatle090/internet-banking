const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsunhantien';
    return db.load(sql);
  },

  loadByIdTaiKhoanNhan: (id, limit, offset) => {
    const sql = `select id, DATE_FORMAT(ngay, "%d/%m/%Y") as ngayNhan, soTaiKhoanGui, giaoDich,
                nganHangGui, noiDungNhan
                from lichsunhantien
                where idTaiKhoanNHNhan = ${id} and
                Date(ngay) BETWEEN Date(DATE_SUB(NOW(), INTERVAL 30 DAY)) AND Date(Now())
                order by ngay desc
                limit ${limit} offset ${offset}`;
    return db.load(sql);
  },

  countByIdTaiKhoanNhan: (id) => {
    const sql = `select count(id) as total from lichsunhantien 
                  where idTaiKhoanNHNhan = ${id}
                  Date(ngay) BETWEEN Date(DATE_SUB(NOW(), INTERVAL 30 DAY)) AND Date(Now())`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'lichsunhantien'),
  del: id => db.del({ id: id }, 'lichsunhantien'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'lichsunhantien')
  },
};
