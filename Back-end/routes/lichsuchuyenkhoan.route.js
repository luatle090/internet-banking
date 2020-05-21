const express = require('express');
const createError = require('http-errors');
const chuyenKhoanModel = require('../models/lichsuchuyenkhoan.model');
const taiKhoanModel = require('../models/taikhoannganhang.model');

const router = express.Router();

// router.get('/', async (req, res, next) => {
//   const rows = await lichsuchuyenkhoanModel.all();
//   res.json(rows);
// })

router.get('/', async (req, res) => {
  const userId = res.locals.token.userId;
  if (isNaN(userId)) {
    throw createError(400, 'Invalid id.');
  }
  if(isNaN(req.query.limit)){
    throw createError(400, 'Invalid limit.');
  }
  if(isNaN(req.query.offset)){
    throw createError(400, 'Invalid offset.');
  }

  const limit = req.query.limit || 10;
  const offset = req.query.limit * req.query.offset || 0;

  try {
    const lichSuChuyenList = await chuyenKhoanModel.loadByIdTaiKhoanGuiWithOutNhacNo(userId, limit, offset);
    const totalItems = await chuyenKhoanModel.countByIdTaiKhoanGuiWithOutNhacNo(userId);
    if (lichSuChuyenList.length === 0 || totalItems.length === 0) {
      res.status(204).end();
    } else {
      const result ={
        totalItems: totalItems[0].total,
        listResult: lichSuChuyenList,
      }
     
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

//xem lịch sử giao dịch tài khoản khách hàng
router.post('/nhanvien', async (req, res) => {
  if (!req.body.soTK) {
    throw createError(400, 'Invalid soTK.');
  }
  if(isNaN(req.query.limit)){
    throw createError(400, 'Invalid limit.');
  }
  if(isNaN(req.query.offset)){
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
    const lichSuChuyenList = await chuyenKhoanModel.loadByIdTaiKhoanGuiWithOutNhacNo(userId, limit, offset);
    const totalItems = await chuyenKhoanModel.countByIdTaiKhoanGuiWithOutNhacNo(userId);
    if (lichSuChuyenList.length === 0 || totalItems.length === 0) {
      res.status(204).end();
    } else {
      const result ={
        totalItems: totalItems[0].total,
        listResult: lichSuChuyenList,
      }
     
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})


router.get('/nhacno', async (req, res) => {
  const userId = res.locals.token.userId;
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const id = req.params.id || -1;
  try {
    const lichSuChuyenList = await lichsuchuyenkhoanModel.loadByIdTaiKhoanGuiWithNhacNo(userId);
    if (lichSuChuyenList.length === 0) {
      res.status(204).end();
    } else {
      res.json(lichSuChuyenList);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.post('/add', async (req, res) => {
  const results = await lichsuchuyenkhoanModel.add(req.body);
  const ret = {
    id: results.insertId,
    ...req.body
  }
  res.status(201).json(ret);
})

// router.delete('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await lichsuchuyenkhoanModel.del(req.params.id);
//   res.json(rs);
// })

// router.patch('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await lichsuchuyenkhoanModel.patch(req.params.id, req.body);
//   res.json(rs);
// })

module.exports = router;