const bcrypt = require('bcryptjs');
const userModel = require('./user.model');

module.exports = {
  login: async entity => {
    // entity = {
    //   username: 'test',
    //   password: '123'
    // }

    const rows = await userModel.singleByUserName(entity.username);
    if (rows === 0)
      return null;

    //console.log(rows)

    const hashPwd = rows[0].password;
    if (bcrypt.compareSync(entity.password, hashPwd)) {
      return rows[0];
    }

    return null;
  }
};