const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from categories';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from categories where CatID = ${id}`;
    return db.load(sql);
  },

  add: entity => db.add(entity, 'categories'),
  del: id => db.del({ CatID: id }, 'categories'),
  patch: (id, entity) => {
    delete entity.CatID;
    return db.patch(entity, { CatID: id }, 'categories')
  },
};
