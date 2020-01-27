const express = require('express');
const createError = require('http-errors');
const thietlapnguoinhanModel = require('../models/thietlapnguoinhan.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const rows = await thietlapnguoinhanModel.all();
  res.json(rows);
})

router.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const id = req.params.id || -1;
  try {
    const rows = await thietlapnguoinhanModel.loadById(id);
    if (rows.length === 0) {
      res.status(204).end();
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end('View error log on console.');
  }
})

router.post('/', async (req, res) => {
  const results = await thietlapnguoinhanModel.add(req.body);
  const ret = {
    CatID: results.insertId,
    ...req.body
  }
  res.status(201).json(ret);
})

router.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await thietlapnguoinhanModel.del(req.params.id);
  res.json(rs);
})

router.patch('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await thietlapnguoinhanModel.patch(req.params.id, req.body);
  res.json(rs);
})

module.exports = router;