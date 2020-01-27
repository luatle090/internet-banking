const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsunhantien';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from lichsunhantien where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'lichsunhantien'),
  del: id => db.del({ id: id }, 'lichsunhantien'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'lichsunhantien')
  },
};
