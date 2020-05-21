const express = require('express');
const createError = require('http-errors');
const nhacNoModel = require('../models/nhacno.model');
const taiKhoanModel = require('../models/taikhoannganhang.model');
const logger = require('log4js').getLogger();
const events = require('./eventNhacNo');
const opts = require('../utils/opts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const userId = res.locals.token.userId;
  if(isNaN(req.query.limit)){
    throw createError(400, 'Invalid limit.');
  }
  if(isNaN(req.query.offset)){
    throw createError(400, 'Invalid offset.');
  }
  if(isNaN(req.query.tinhTrang)){
    throw createError(400, 'Invalid tinhTrang.');
  }
  if(isNaN(req.query.loai)){
    throw createError(400, 'Invalid loai.');
  }

  const limit = Number(req.query.limit) || 10;
  const offset = limit * Number(req.query.offset) || 0;
  const tinhTrang = Number(req.query.tinhTrang) || null;

  try {
    let nhacNoArray = [];
    if(Number(req.query.loai) === 0){
      nhacNoArray = await nhacNoModel.getNoTaoByIdTaiKhoan(userId, tinhTrang, limit, offset);
    }
    else{
      nhacNoArray = await nhacNoModel.getNhacNoByIdTaiKhoan(userId, tinhTrang, limit, offset);
    }
    
    if(nhacNoArray[0].length === 0 || nhacNoArray[1].length === 0){
      res.status(204).end();
    }
    else{
      const result = {
        totalItems: nhacNoArray[1][0].total,
        listResult: nhacNoArray[0]
      };
      res.json(result);
    }
    
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.post('/', async (req, res) => {
  const idTaiKhoanTao = res.locals.token.userId;

  if(isNaN(req.body.idTaiKhoanNo)){
    throw createError(400, 'Invalid tienNo.');
  }
  if(isNaN(req.body.tienNo)){
    throw createError(400, 'Invalid tienNo.');
  }
  if(!req.body.hasOwnProperty('noiDung')){
    throw createError(400, 'Invalid noiDung.');
  }
  if(idTaiKhoanTao === req.body.idTaiKhoanNo){
    throw createError(409, 'trung nguoi tao.');
  }

  const ngayTao = new Date();
  const entity ={
    ...req.body,
    ngayTao,
    tinhTrang: opts.STATUS.CHUA_THANH_TOAN,
    idTaiKhoanTao
  }

  //check idTaiKhoanNo
  const rowsTaiKhoanNo = await taiKhoanModel.getInfoById(req.body.idTaiKhoanNo);
  if(rowsTaiKhoanNo.length === 0){
    throw createError(404, 'Not found taiKhoanNo');
  }

  try{
    const result = await nhacNoModel.add(entity);
    if(result.insertId > 0){
      
      //format entity
      var options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      entity.ngayTao = ngayTao.toLocaleDateString("vi-VI", options);
      entity.tinhTrang = 'Chưa trả nợ';
      entity.nguoiNo = res.locals.token.hoTen;
      entity.idNhacNo = result.insertId;
      entity.soTK = rowsTaiKhoanNo[0].soTK;
      // delete entity.idTaiKhoanNo;
      // delete entity.idTaiKhoanTao;
      
      //console.log(entity);
      events.publishNhacNoAdded(entity);
      res.status(201).json({
        message: "success"
      });
    }
    else{
      res.status(204).end();
    }
    
  } catch(err){
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }
  try{
    const rs = await nhacNoModel.del(req.params.id);
    console.log(rs);
    if(rs.affectedRows > 0){
      res.json({
        affectedRows: rs.affectedRows
      }).end();
    } else{
      res.status(204).end();
    }
  } catch(err){
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
 
})

// router.get('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const id = req.params.id || -1;
//   try {
//     const rows = await nhacNoModel.loadById(id);
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

// router.patch('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await nhacNoModel.patch(req.params.id, req.body);
//   res.json(rs);
// })


router.post('/nhanvien', async (req, res) => {
  if (!req.body.soTK) {
    throw createError(400, 'Invalid soTK.');
  }
  if (isNaN(req.query.limit)) {
    throw createError(400, 'Invalid limit.');
  }
  if (isNaN(req.query.offset)) {
    throw createError(400, 'Invalid offset.');
  }

  const taiKhoanRS = await taiKhoanModel.loadBySoTK(req.body.soTK);
  if(taiKhoanRS.length === 0){
    throw createError(204, 'Not found');
  }
  const userId = taiKhoanRS[0].id;
  const limit = req.query.limit || 10;
  const offset = req.query.limit * req.query.offset || 0;

  try {
    const [lichSuNhanGuiNo,totalItems] = await nhacNoModel.getGiaoDichNhacNoByIdTaiKhoan(userId,null, parseInt(limit), offset);
    if (lichSuNhanGuiNo.length === 0 || totalItems.length === 0) {
      res.status(204).end();
    } else {
      const result = {
        totalItems: totalItems[0].total,
        listResult: lichSuNhanGuiNo
      }
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

module.exports = router;