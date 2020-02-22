const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const moment = require('moment');
const createError = require('http-errors');
const otps = require('../utils/opts')
const jwt = require('jsonwebtoken');

module.exports = {
  login: async entity => {
    // entity = {
    //   username: 'kh1',
    //   password: '123'
    // }


    sql = `select tk.*, kh.email, kh.hoTen
            from taikhoannganhang tk left join 
            khachhang kh on tk.idKhachHang = kh.id
            where tk.username = '${entity.username}'`;

    
    const rows = await db.load(sql);
    if (rows.length === 0)
      return null;


    const hashPwd = rows[0].password;
    if (bcrypt.compareSync(entity.password, hashPwd)) {
      return rows[0];
    }

    return null;
  },
  
  //RefreshToken

  updateRefreshToken: async (userId, refreshToken, isNhanVien) => {
    var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
    var resultInsert = 0;
    const results = await db.del(userId, 'refreshtoken');
    const entity = {
      userId: userId,
      refreshToken: refreshToken,
      date: rdt,
      isNhanVien: isNhanVien  //nếu userId là của NV thì đánh true
    };
    resultInsert = await db.add(entity, 'refreshToken');
    
    //trả về id
    return resultInsert;
  },

  loadTaiKhoanById: id => {
    const sql = `select tk.*, kh.email, kh.hoTen
                  from taikhoannganhang tk left join 
                  khachhang kh on tk.idKhachHang = kh.id
                  where tk.id = '${id}'`;
    return db.load(sql);                         
  },
  
  deleteRefreshToken: userId => db.del({ userId: userId }, 'refreshtoken'),

  verifyRefreshToken: refreshToken => {
    const sql = `select * from refreshtoken where refreshToken = '${refreshToken}'`;
    return db.load(sql);
  },

  verifyAccessToken: (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, otps.ACCESS_TOKEN.SECRET_KEY, function (err, payload) {
        if (err) throw createError(403, err);
        
        res.locals.token = payload;
        next();
      });
    } else {
      throw createError(401, 'NO_TOKEN');
    }
  }
};