const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from lichsuchuyenkhoan';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from lichsuchuyenkhoan where id = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'lichsuchuyenkhoan'),
  del: id => db.del({ id: id }, 'lichsuchuyenkhoan'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'lichsuchuyenkhoan')
  },
};
