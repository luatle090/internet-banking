const express = require('express');
const createError = require('http-errors');
const chuyenKhoanModel = require('../models/chuyenkhoan.model');
const taiKhoanModel = require('../models/taikhoannganhang.model');
const logger = require('log4js').getLogger();
const mailer = require('../utils/mailer');
const pgpApi = require('../utils/pgpApi');
const rsaApi = require('../utils/rsaApi');

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
    res.status(204).end();
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


router.post('/', async (req, res, next) => {
    let date = Date.now();
    var checkSum = await pgpApi.sign('HHH', date, req.body);
    //await new Promise(resolve => setTimeout(resolve, 3000));
    //date = Date.now();
    const valid  = await pgpApi.verify(checkSum, "HHH", date, req.body);
    if (valid){
      res.status(200).json({
        message: "success"
      }).end();
    }
    else{
      res.status(403).end();
    }

});


router.post('/rsa', async (req, res, next) => {
  let date = Date.now();
  var checkSum = await rsaApi.sign('HHH', date, req.body);
  //await new Promise(resolve => setTimeout(resolve, 3000));
  //date = Date.now();
  const valid = await rsaApi.verifyChecksum(checkSum, "HHH", date, req.body);
  if (valid){
    res.status(200).json({
      message: "success"
    }).end();
  }
  else{
    res.status(403).end();
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