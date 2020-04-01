const express = require('express');
const createError = require('http-errors');
const lichsunhantienModel = require('../models/lichsunhantien.model');

const router = express.Router();

// router.get('/', async (req, res, next) => {
//   const rows = await lichsunhantienModel.all();
//   res.json(rows);
// })

router.get('/', async (req, res) => {
  const userId = res.locals.token.userId;
  if (isNaN(userId)) {
    throw createError(400, 'Invalid id.');
  }
  if (isNaN(req.query.limit)) {
    throw createError(400, 'Invalid limit.');
  }
  if (isNaN(req.query.offset)) {
    throw createError(400, 'Invalid offset.');
  }

  const limit = req.query.limit || 10;
  const offset = req.query.limit * req.query.offset || 0;
  const id = userId || -1;

  try {
    const lichSuNhanTienList = await lichsunhantienModel.loadByIdTaiKhoanNhan(id, limit, offset);
    const totalItems = await lichsunhantienModel.countByIdTaiKhoanNhan(id);
    if (lichSuNhanTienList.length === 0 || totalItems.length === 0) {
      res.status(204).end();
    } else {
      const result = {
        totalItems: totalItems[0].total,
        listResult: lichSuNhanTienList
      }
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.post('/', async (req, res) => {
  const results = await lichsunhantienModel.add(req.body);
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

//   const rs = await lichsunhantienModel.del(req.params.id);
//   res.json(rs);
// })

// router.patch('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await lichsunhantienModel.patch(req.params.id, req.body);
//   res.json(rs);
// })

module.exports = router;