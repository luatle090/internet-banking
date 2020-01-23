const bcrypt = require('bcryptjs');
const db = require('../utils/db');

module.exports = {
  add: entity => {
    // entity = {
    //   f_Username: "test",
    //   f_Password: "test",
    //   f_Name: "test",
    //   f_Email: "test@test.c",
    //   f_DOB: "2000-09-01",
    //   f_Permission: 0
    // }
    const hash = bcrypt.hashSync(entity.f_Password, 8);
    entity.f_Password = hash;
    return db.add(entity, 'users')
  },

  singleByUserName: userName => db.load(`select * from users where f_UserName = '${userName}'`),
};
