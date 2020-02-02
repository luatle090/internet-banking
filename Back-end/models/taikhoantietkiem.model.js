const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from taikhoantietkiem';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from taikhoantietkiem where id = ${id}`;
    return db.load(sql);
  },

  getByIdTaikhoan: idTaikhoan => {
    const sql =`select * from taikhoantietkiem where idTaiKhoan = ${idTaikhoan}`
    return db.load(sql);
  },

  add: entity => {
    return db.add(entity, 'taikhoantietkiem')
  },

  del: id => db.del({ id: id }, 'taikhoantietkiem'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'taikhoantietkiem')
  },
};
