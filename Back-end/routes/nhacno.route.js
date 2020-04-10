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
  if(!req.body.noiDung){
    throw createError(400, 'Invalid noiDung.');
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
      entity.hoten = res.locals.token.hoTen;
      entity.idNhacNo = result.insertId;
      delete entity.idTaiKhoanNo;
      delete entity.idTaiKhoanTao;
      console.log(entity);
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
    res.json({
      affectedRows: rs.affectedRows
    });
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

module.exports = router;