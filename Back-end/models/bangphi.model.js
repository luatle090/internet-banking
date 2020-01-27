const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from bangphi';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from bangphi where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'bangphi'),
  del: id => db.del({ id: id }, 'bangphi'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'bangphi')
  },
};
