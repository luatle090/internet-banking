const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const moment = require('moment');
const createError = require('http-errors');
const otps = require('../utils/opts')
const jwt = require('jsonwebtoken');
const logger = require('log4js').getLogger();

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
  loginAdmin: async entity => {
    // entity = {
    //   username: 'kh1',
    //   password: '123'
    // }


    sql = `select nv.*, vt.moTa from nhanvien nv inner join vaitro vt on nv.idVaiTro = vt.id 
            where nv.username = '${entity.username}'`;

    
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
    const results = await db.del({ userId }, 'refreshtoken');
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
                  from taikhoannganhang tk inner join 
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
    const token = req.headers[otps.ACCESS_TOKEN.HEADER];
    if (token) {
      jwt.verify(token, otps.ACCESS_TOKEN.SECRET_KEY, function (err, payload) {
        if (err) throw createError(403, err);
        
        res.locals.token = payload;
        next();
      });
    } else {
      throw createError(401, 'NO_TOKEN');
    }
  },

  // return 0: success
  //
  patchPassword: async (id, entity) => {
    sql = `select password from taikhoannganhang where id = '${id}'`;

    const rows = await db.load(sql);
    if(rows.length > 0)
    {
      const hashPwd = rows[0].password;
      if (bcrypt.compareSync(entity.passwordOld, hashPwd)) {
        if(!bcrypt.compareSync(entity.password, hashPwd)){
          const hash = bcrypt.hashSync(entity.password, 8);
          entity.password = hash;
          delete entity.passwordOld;
          result = db.patch(entity, { id: id }, 'taikhoannganhang')
          logger.info('userId: '+ id + ' has updated password affected rows ' + result.changedRows)
          return otps.STATUS_PASSWORD.SUCCESS;
        }
        else{
          //password mới giống password cũ => ko cho đổi
          return otps.STATUS_PASSWORD.NEW_PWD_IS_LIKE_OLD_PWD;
        }
     
      }
      else{
        //password cũ sai => ko cho đổi
        return otps.STATUS_PASSWORD.WRONG_PWD;
      }
    }
    else{
      return otps.STATUS_PASSWORD.FAILED;
    }
  },

  findUserByUsername: entity => {
    sql = `select kh.email, kh.hoTen
            from taikhoannganhang tk inner join 
            khachhang kh on tk.idKhachHang = kh.id
            where tk.username = '${entity.username}'`;

    return db.load(sql);

  },

  forgotPassword: (username, entity) => {
    const hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash;
    result = db.patch(entity, { username: username }, 'taikhoannganhang')
    return result;
  }

};