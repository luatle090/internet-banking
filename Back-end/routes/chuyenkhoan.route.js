const express = require('express');
const createError = require('http-errors');
const chuyenKhoanModel = require('../models/chuyenkhoan.model');
const taiKhoanModel = require('../models/taikhoannganhang.model');
const logger = require('log4js').getLogger();
const mailer = require('../utils/mailer');
const pgpApi = require('../utils/pgpApi');
const rsaApi = require('../utils/rsaApi');
const doiTacModel = require('../models/doitac.model');
const otps = require('../utils/opts');
const axios = require('axios');

const router = express.Router();

var verifyAccessToken = require('../models/auth.model').verifyAccessToken;

router.post('/noibo', verifyAccessToken, async (req, res, next) => {
  const userId = res.locals.token.userId;
  const username = res.locals.token.username;
  if (!req.body.userIdNhan) {
    return res.status(401).json({ message: "userIdNhan is required" });
  }
  if (!req.body.giaoDich) {
    return res.status(401).json({ message: "giaoDich is required" });
  }
  if (!req.body.token) {
    return res.status(401).json({ message: "otp is required" });
  }
  if(userId == req.body.userIdNhan){
    return res.status(409).json({ message: "trung nguoi nhan" });
  }

  if(!mailer.checkOTP(username, req.body.token)){
    return res.status(404).json({message: "wrong token"});
  }

  if(req.body.giaoDich <=0 ){
    throw createError(400, 'Giao dich khong hop le');
  }

  var ngayCK = new Date();
  try{
    const rows = await chuyenKhoanModel.chuyenKhoanNoiBo(userId, req.body, ngayCK);
    var status = rows[1][0].status;
    if(status === 0){
      logger.info("Giao dich thanh cong");
      res.status(201).json({
          message: "success"
      }).end();
    }
    else if (status === -1){
      logger.info("Khong du tien hoac khong ton tai nguoi nhan");
      res.status(204).end();
    }
    else {
      logger.error("Giao dich that bai");
      res.status(500).end('rollback transaction');
    }
    
  } catch (err) {
      logger.error(err);
      res.status(500);
      res.end('View error log on console.');
  }
})


router.get('/getotp', verifyAccessToken, async (req, res) => {
  const userId = res.locals.token.userId;

  const row = await taiKhoanModel.getInfoById(userId);

  if(row.length === 0){
    return res.status(204).end();
  }

  const username = res.locals.token.username;
  const email = row[0].email;
  const hoTen = res.locals.token.hoTen;

  try {
    const info = await mailer.sendEmailOTP(email, username, hoTen);
    logger.info('mail has sent: ', info.accepted);
    logger.info('response from gmail: ', info.response);
    res.status(201).json({
      message: info.accepted
    });
  } catch (error) {
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
});


router.post('/noptien', async (req, res, next) => {
  //header
  if (!req.headers[otps.API.HEADER_PARTNERCODE]) {
    throw createError(400, 'Invalid partnerCode.');
  }
  if (!req.headers[otps.API.HEADER_CHECKSUM]) {
    throw createError(400, 'Invalid checksum.');
  }
  if (!req.headers[otps.API.HEADER_NGAY_CHUYEN_KHOAN] 
        || isNaN(req.headers[otps.API.HEADER_NGAY_CHUYEN_KHOAN])) {
    throw createError(400, 'Invalid ngayCK.');
  }
  
  //body
  if (!req.body.soTKGui) {
    throw createError(400, 'Invalid soTKGui.');
  }
  if (!req.body.soTKNhan) {
    throw createError(400, 'Invalid soTKNhan.');
  }
  if (!req.body.giaoDich) {
    throw createError(400, 'Invalid giaoDich.');
  }
  if (!req.body.noiDung) {
    throw createError(400, 'Invalid noiDung.');
  }

  const partnerCode = req.headers[otps.API.HEADER_PARTNERCODE];
  let checksum = req.headers[otps.API.HEADER_CHECKSUM];
  const ngayCK = req.headers[otps.API.HEADER_NGAY_CHUYEN_KHOAN];

  //check timesamp
  let date = new Date();
  date.setMinutes(date.getMinutes() - otps.API.MINUTES);
  if(ngayCK > Date.now() || ngayCK < date.getTime()){
    throw createError(403, 'Thoi gian het han');
  }

  //let date = Date.now();
  //var checksum = await pgpApi.sign(obj);
  //await new Promise(resolve => setTimeout(resolve, 3000));
  //date = Date.now();

  const rowsDoiTac = await doiTacModel.loadByCode(partnerCode);
  if(rowsDoiTac.length === 0){
    throw createError(404, 'Ngan hang doi tac not found');  
  }

  const obj = {
    partnerCode: partnerCode,
    timesamp: ngayCK,
    ...req.body
  }

  try{
    //check checksum
    logger.info('check checksum');
    //checksum = await pgpApi.sign(obj);
    const valid = await pgpApi.verify(checksum, obj);
    if (valid){
      //save checksum
      obj.checksum = checksum;
      
      //chuyen khoan
      const rows = await chuyenKhoanModel.NopTienVaoTaiKhoan(obj, new Date());
      
      var status = rows[1][0].status;
      if(status === 0){
        logger.info("Giao dich thanh cong");
        res.status(201).json({
            message: "success"
        }).end();
      }
      else if (status === -1){
        logger.info("Khong ton tai nguoi nhan");
        res.status(204).end();
      }
      else {
        logger.error("Giao dich that bai");
        res.status(500).end('rollback transaction');
      }
    }
    else{
      res.status(403).json({
        message: "Goi tin bi sua doi"
      }).end();
    }
  } catch(err){
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
});


router.post('/trutien', verifyAccessToken, async (req, res, next) => {
  //await new Promise(resolve => setTimeout(resolve, 3000));
  
  const userId = res.locals.token.userId;

  if (!req.body.soTKNhan) {
    throw createError(400, 'Invalid soTKNhan.');
  }
  if (!req.body.giaoDich) {
    throw createError(400, 'Invalid giaoDich.');
  }
  if (!req.body.noiDung) {
    throw createError(400, 'Invalid noiDung.');
  }
  if (!req.body.partnerCode) {
    throw createError(400, 'Invalid partnerCode.');
  }

  //kiểm tra giao dịch
  const rowsTaiKhoan = await taiKhoanModel.loadById(userId);
  if(rowsTaiKhoan.length === 0){
    throw createError(204, '');
  }
  else if(rowsTaiKhoan[0].soDu <= req.body.giaoDich){
    throw createError(406, 'So du khong du thuc hien');
  }

  //lấy uri cua doi tac
  const rowsDoiTac = await doiTacModel.loadByCode(req.body.partnerCode);
  if(rowsDoiTac.length === 0) {
    throw createError(404, 'Ngan hang doi tac not found');
  }

  const entity = {
    partnerCode: req.body.partnerCode,
    ngayCK: Date.now(),
    soTKGui: rowsTaiKhoan[0].soTK,
    soTKNhan: req.body.soTKNhan,
    giaoDich: req.body.giaoDich,
    noiDung: req.body.noiDung
  }

  try{
    const url = rowsDoiTac[0].api;
    let checkSum = "";
    var data;
    if(rowsDoiTac[0].chuanChuKy.toUpperCase() == otps.SIGNATURE.PGP.toUpperCase()){
      checkSum = await pgpApi.sign(entity);
      data = {

      }
    }
    else{
      checkSum = await rsaApi.sign(entity);
      data = {

      }
    }

    //call API
    // const resAPI = await axios({
    //   method: 'post',
    //   url: url,
    //   data: data,
    //   validateStatus: function (status) {
    //     return status >= 200 && status < 500;
    //   }
    // });

    await new Promise(resolve => setTimeout(resolve, 2000));
    let resAPI = {};

    resAPI.status = 200;
    if (resAPI.status === 201){
      entity.checksum = checkSum;
      const rows = await chuyenKhoanModel.chuyenKhoanLienNH(userId, entity, new Date());
      var status = rows[1][0].status;

      if(status === 0){
        logger.info("giao dich thanh cong");
        res.status(201).json({
          message: "success"
        }).end();
      }
      else{
        logger.info("giao dich that bai");
        res.status(204).end();
      }
    }
    else{
      logger.info("ngan hang doi tac truc trac");
      res.status(403).end();
    }
  } catch(err){
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
});



// router.get('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const id = req.params.id || -1;
//   try {
//     const rows = await chuyenKhoanModel.loadById(id);
//     if (rows.length === 0) {
//       res.status(204).end();
//     } else {
//       res.json(rows[0]);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500);
//     res.end('View error log on console.');
//   }
// })

// router.post('/', async (req, res) => {
//   const results = await chuyenKhoanModel.add(req.body);
//   const ret = {
//     id: results.insertId,
//     ...req.body
//   }
//   res.status(201).json(ret);
// })

// router.delete('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await chuyenKhoanModel.del(req.params.id);
//   res.json(rs);
// })

// router.patch('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await chuyenKhoanModel.patch(req.params.id, req.body);
//   res.json(rs);
// })

module.exports = router;