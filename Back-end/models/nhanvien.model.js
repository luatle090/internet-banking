const db = require('../utils/db');

module.exports = {
    all: () => {
        const sql = 'select * from nhanvien';
        return db.load(sql);
    },

    loadById: id => {
        const sql = `select * from nhanvien where id = ${id}`;
        return db.load(sql);
    },

    add: entity => db.add(entity, 'nhanvien'),
    del: id => db.del({ id: id }, 'nhanvien'),
    patch: (id, entity) => {
        delete entity.id;
        return db.patch(entity, { id: id }, 'nhanvien')
    },
};
