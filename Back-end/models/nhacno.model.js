const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from nhacno';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from nhacno where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'nhacno'),
  del: id => db.del({ id: id }, 'nhacno'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'nhacno')
  },
};
