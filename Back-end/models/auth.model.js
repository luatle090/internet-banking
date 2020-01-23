const bcrypt = require('bcryptjs');
const userModel = require('./user.model');

module.exports = {
  login: async entity => {
    // entity = {
    //   user: 'test',
    //   pwd: 'test'
    // }

    const rows = await userModel.singleByUserName(entity.user);
    if (rows === 0)
      return null;

    const hashPwd = rows[0].f_Password;
    if (bcrypt.compareSync(entity.pwd, hashPwd)) {
      return rows[0];
    }

    return null;
  }
};
