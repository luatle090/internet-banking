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
    const hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash;
    return db.add(entity, 'taikhoannganhang')
  },

  singleByUserName: userName => db.load(`select * from taikhoannganhang where username = '${userName}'`),
  
};
