const express = require('express');
const createError = require('http-errors');
const taikhoannganhangModel = require('../models/taikhoannganhang.model');
const taikhoantietkiemModel = require('../models/taikhoantietkiem.model')

const router = express.Router();

router.get('/', async (req, res, next) => {
  const rows = await taikhoannganhangModel.all();
  res.json(rows);
})

router.get('/danhsachtaikhoan', async (req, res) => {
  const userId = res.locals.token.userId;
  if (isNaN(userId)) {
    throw createError(400, 'Invalid id.');
  }
  const id = userId || -1;
  
  const tkng = await taikhoannganhangModel.loadById(id);
  const tktk = await taikhoantietkiemModel.getByIdTaikhoan(id);
  if (tkng.length === 0) {
    res.status(204).end();
  } else {
    const tk = {
      tkng: tkng[0],
      tktk
    }
    res.json(tk);
  }
})

router.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const id = req.params.id || -1;
  const rows = await taikhoannganhangModel.loadById(id);
  if (rows.length === 0) {
    res.status(204).end();
  } else {
    res.json(rows[0]);
  }
})

router.post('/', async (req, res) => {
  req.body.soTK = 0;
  console.log(req.body)
  const results = await taikhoannganhangModel.add(req.body);
  const tknh = await taikhoannganhangModel.patch(results.insertId,{soTK: results.insertId});
  const ret = {
    id: results.insertId,
    ...req.body,
    soTK: results.insertId
  }
  delete ret.password;
  res.status(201).json(ret);
})

router.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await taikhoannganhangModel.del(req.params.id);
  res.json(rs);
})

router.patch('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await taikhoannganhangModel.patch(req.params.id, req.body);
  res.json(rs);
})

module.exports = router;