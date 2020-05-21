const express = require('express');
const createError = require('http-errors');
const logger = require('log4js');
const thietLapModel = require('../models/thietlapnguoinhan.model');
const taiKhoanModel = require('../models/taikhoannganhang.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const userId = res.locals.token.userId;

  try{
    const rows = await thietLapModel.getInfoThiepLapByUserId(userId);
    if(rows.length === 0){
      res.status(204).end();
    }
    else{
      res.status(200).json(rows).end();
    }
  }catch(err) {
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.get('/detail', async (req, res) => {
  const userId = res.locals.token.userId;

  if (isNaN(req.query.limit)) {
    throw createError(400, 'Invalid limit.');
  }
  if (isNaN(req.query.offset)) {
    throw createError(400, 'Invalid offset.');
  }

  const taiKhoanRS = await taiKhoanModel.loadById(userId);
  if(taiKhoanRS.length === 0){
    throw createError(204, 'Not found');
  }
  const limit = req.query.limit || 10;
  const offset = req.query.limit * req.query.offset || 0;

  try {
    const [ThietLapNguoiNhan,totalItems] = await thietLapModel.getThietLapByIdTaiKhoan(userId, parseInt(limit), offset);
    if (ThietLapNguoiNhan.length === 0 || totalItems.length === 0) {
      res.status(204).end();
    } else {
      const result = {
        totalItems: totalItems[0].total,
        listResult: ThietLapNguoiNhan
      }
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

// router.get('/', async (req, res, next) => {
//   const rows = await thietlapnguoinhanModel.all();
//   res.json(rows);
// })

// router.get('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const id = req.params.id || -1;
//   try {
//     const rows = await thietlapnguoinhanModel.loadById(id);
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
//   const results = await thietlapnguoinhanModel.add(req.body);
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

//   const rs = await thietlapnguoinhanModel.del(req.params.id);
//   res.json(rs);
// })

// router.patch('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await thietlapnguoinhanModel.patch(req.params.id, req.body);
//   res.json(rs);
// })

module.exports = router;