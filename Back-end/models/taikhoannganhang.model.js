const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from taikhoannganhang';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from taikhoannganhang where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'taikhoannganhang'),
  del: id => db.del({ id: id }, 'taikhoannganhang'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'taikhoannganhang')
  },
};
