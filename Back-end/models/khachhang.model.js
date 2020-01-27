const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from khachhang';
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
