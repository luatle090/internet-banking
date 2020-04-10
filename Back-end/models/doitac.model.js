const db = require('../utils/db');

module.exports = {
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
