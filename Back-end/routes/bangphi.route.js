const express = require('express');
const createError = require('http-errors');
const bangphiModel = require('../models/bangphi.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const rows = await bangphiModel.all();
  res.json(rows);
})

router.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const id = req.params.id || -1;
  try {
    const rows = await bangphiModel.loadById(id);
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
  const results = await bangphiModel.add(req.body);
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

  const rs = await bangphiModel.del(req.params.id);
  res.json(rs);
})

router.patch('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await bangphiModel.patch(req.params.id, req.body);
  res.json(rs);
})

module.exports = router;