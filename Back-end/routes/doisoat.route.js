const express = require('express');
const createError = require('http-errors');
const doitacModel = require('./../models/doitac.model')

const router = express.Router();

router.get('/', async (req, res) => {
  if (isNaN(req.query.limit)) {
    throw createError(400, 'Invalid limit.');
  }
  if (isNaN(req.query.offset)) {
    throw createError(400, 'Invalid offset.');
  }

  const tungay = req.query.tungay || "";
  const denngay = req.query.denngay || "";
  const nganhang = req.query.nganhang || "";
  const limit = req.query.limit || 10;
  const offset = req.query.limit * req.query.offset || 0;

  try {
    const [ThietLapNguoiNhan,totalItems] = await doitacModel.getlist(tungay,denngay,nganhang, parseInt(limit), offset);
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


module.exports = router;