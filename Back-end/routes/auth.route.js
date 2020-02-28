const express = require('express');
const jwt = require('jsonwebtoken');
const rndToken = require('rand-token');
const authModel = require('../models/auth.model');
const nhanVienModel = require('../models/nhanvien.model');
const opts = require('../utils/opts');
const request = require('request');
const router = express.Router();
const mailer = require('../utils/mailer');
const logger = require('log4js').getLogger();

//
// login

router.post('/', async (req, res) => {
  // req.body = {
  // 	user: 'test',
  // 	pwd: 'test'
  // }
  if (!req.body.recaptchaToken) {
    return res.status(400).json({ message: "recaptchaToken is required" });
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "username or password are required" });
  }

  //verify google
  var verify = '6Lca6tgUAAAAALu-FiNSIz34De4EA59U-jlB5Flc';
  const verifyCaptchaOptions = {
    uri: "https://www.google.com/recaptcha/api/siteverify",
    json: true,
    form: {
      secret: opts.CAPTCHA.SECRET_KEY,
      response: req.body.recaptchaToken
    }
  };
  
  request.post(verifyCaptchaOptions, async (err, response, body) => {
    if (err) {
      return res.status(500).json({ message: "oops, something went wrong on our side" });
    }

    if (!body.success) {
      return res.status(520).json({ message: body["error-codes"].join(".") });
    }
    const ret = await authModel.login(req.body);
    if (ret === null) {
      return res.json({
        authenticated: false
      });
    }
    
    const token = generateAccessToken(ret);
    const rfToken = rndToken.generate(opts.REFRESH_TOKEN.SIZE);
    const result = await authModel.updateRefreshToken(ret.id, rfToken, false);
    if(result.insertId > 0){
      res.status(201).json({
        // authenticated: true,
        accessToken: token,
        refreshToken: rfToken
      })
    }
    else{
      res.json({
        authenticated: false
      });
    }
    console.log('Username login: ', ret.username);
      // thêm token vào db addToken()
    // Save the user to the database. At this point they have been verified.
    // });
  });
});


/**
 * body: {
 *    "user": "",
 *    "password": "",
 *    "recaptchaToken": ""
 * }
 * 
 * 
 */
router.post('/admin', async (req, res) => {
  // req.body = {
  // 	user: 'test',
  // 	password: 'test'
  // }
  if (!req.body.recaptchaToken) {
    return res.status(400).json({ message: "recaptchaToken is required" });
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "username or password are required" });
  }

  //verify google
  var verify = '6Lca6tgUAAAAALu-FiNSIz34De4EA59U-jlB5Flc';
  const verifyCaptchaOptions = {
    uri: "https://www.google.com/recaptcha/api/siteverify",
    json: true,
    form: {
      secret: opts.CAPTCHA.SECRET_KEY,
      response: req.body.recaptchaToken
    }
  };
  
  request.post(verifyCaptchaOptions, async (err, response, body) => {
    if (err) {
      return res.status(500).json({ message: "oops, something went wrong on our side" });
    }

    if (!body.success) {
      return res.status(520).json({ message: body["error-codes"].join(".") });
    }
    const ret = await authModel.loginAdmin(req.body);
    if (ret === null) {
      return res.json({
        authenticated: false
      });
    }
    
    const token = generateAccessToken(ret);
    const rfToken = rndToken.generate(opts.REFRESH_TOKEN.SIZE);
    const result = await authModel.updateRefreshToken(ret.id, rfToken, false);
    if(result.insertId > 0){
      res.status(201).json({
        // authenticated: true,
        accessToken: token,
        refreshToken: rfToken
      })
    }
    else{
      res.json({
        authenticated: false
      });
    }
    logger.info('Username login:', ret.username);
      // thêm token vào db addToken()
    // Save the user to the database. At this point they have been verified.
    // });
  });
});


function generateAccessToken(ret){
  const payload = {
      userId: ret.id,
      username: ret.username,
      email: ret.email,
      hoTen: ret.hoTen,
      vaiTro: ret.idVaiTro,
      vaiTroMT: ret.moTa
  }
  const token = jwt.sign(payload, opts.ACCESS_TOKEN.SECRET_KEY, {
    expiresIn:  opts.ACCESS_TOKEN.LIFETIME // 10 mins
  });
  return token;
}

/**
 * body: {
 *      "refreshToken": ""
 * }
 * 
 */
router.post('/renew-token', async (req, res) => {
  // req.body = {
    // 	refreshToken: '2kjwAhv7OBWW',
  // }
  if (!req.body.refreshToken) {
    throw createError(400, 'Invalid refreshToken.');
  }

  try{ 
    var rToken = req.body.refreshToken;
    //verify refresh token có lưu ở DB
    const rows = await authModel.verifyRefreshToken(rToken);
    if(rows.length === 0){
      res.status(204).end();
    }
    
    //sau đó lấy userID để truy vấn thông tin và cấp lại access token
    var rowTaiKhoan;
    var isNhanVien = rows[0].isNhanVien;
    if(!isNhanVien){
      rowTaiKhoan = await authModel.loadTaiKhoanById(rows[0].userId);
      
    }
    else{
      rowTaiKhoan = await nhanVienModel.loadById(rows[0].id);
    }

    if(rowTaiKhoan.length === 0){
      res.status(204).end();
    }
    var userObj = rowTaiKhoan[0];
    const token = generateAccessToken(userObj);
    logger.info('refreshToken of username: ', userObj.username);
    res.status(201).json({
      accessToken: token
    });
  }
  catch(err){
    logger.error(err);
    res.statusCode = 500;
    res.end('View error log on console.');
  }
});

//khong can body chi can access token
router.get('/logout', authModel.verifyAccessToken, async (req, res) => {
  var userId = res.locals.token.userId;
  try{
    const result = await authModel.deleteRefreshToken(userId);
    logger.info('del refesh token affectedRows: ' + result.affectedRows)
    if(result.affectedRows > 0){
      res.status(201).json({
        msg: 'success'
      });
    }
    else{
      res.status(204).end();
    }
  }
  catch(err){
    logger.error(err);
    res.statusCode = 500;
    res.end('View error log on console.');
  }

});

/**
 *  body: {
 *          "username": ""
 *      }
 */
router.post('/forgot',  async (req, res) => {
  if (!req.body.username) {
    return res.status(400).json({ message: "username is required" });
  }

  try{
    const rs = await authModel.findUserByUsername(req.body);
    if(rs.length === 0){
      res.status(204).end();
    }
    else{
      //sẽ gửi mã OTP về email
      const info = await mailer.sendEmailOTP(rs[0].email, req.body.username, rs[0].hoTen);
      logger.info('mail has sent: ', info.accepted);
      logger.info('response from gmail: ', info.response);
      res.status(201).json({
        message: info.accepted
      });
    }
  }catch(err){
    logger.error(err);
    res.statusCode = 500;
    res.end('View error log on console.');
  }
});

/**
 * body:
 *      "username": "",
 *      "password": "",
 *      "token": ""
 */
router.patch('/changepassword', async (req, res) => {
  if (!req.body.username) {
    return res.status(400).json({ message: "username is required" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "password is required" });
  }
  if (!req.body.token) {
    return res.status(400).json({ message: "token OTP is required" });
  }

  try{
    const username = req.body.username;
    const token = req.body.token;
    delete req.body.username;
    delete req.body.token;
    
    if(mailer.checkOTP(username, token)){
      const result = await authModel.forgotPassword(username, req.body);
      logger.info("username: " + username + " has change password affected rows ", result.affectedRows);
      res.status(200).json({
        message: "success"
      })
    } else{
      res.status(200).json({
        message: "wrong token"
      })
    }
  }
  catch(err){
    logger.error(err);
    res.statusCode = 500;
    res.end('View error log on console.');
  }

});

module.exports = router;