const express = require('express');
const userModel = require('../models/user.model');

const router = express.Router();

router.post('/', async (req, res) => {
  const results = await userModel.add(req.body);
  const ret = {
    f_ID: results.insertId,
    ...req.body
  }
  delete ret.f_Password;
  res.status(201).json(ret);
})

module.exports = router;