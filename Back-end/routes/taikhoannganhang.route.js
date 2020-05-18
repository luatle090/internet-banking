const express = require('express');
const createError = require('http-errors');
const taikhoannganhangModel = require('../models/taikhoannganhang.model');
const taikhoantietkiemModel = require('../models/taikhoantietkiem.model');
const auth = require('../models/auth.model');
const opts = require('../utils/opts');
const logger = require('log4js').getLogger();

const router = express.Router();

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
    delete tk.tkng.password;
    delete tk.tkng.username;
    res.json(tk);
  }
})

router.get('/:soTK', async (req, res) => {
  if (isNaN(req.params.soTK)) {
    throw createError(400, 'Invalid soTK.');
  }

  try {
    const rows = await taikhoannganhangModel.loadBySoTK(req.params.soTK);
    if (rows.length === 0) {
      res.status(204).end();
    }
    else {
      const userId = res.locals.token.userId;
      if(rows[0].id !== userId)
        res.json(rows[0]);
      else
        res.status(409).json({
          message: "trung thong tin"
        });
    }
  } catch (error) {
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
//   const rows = await taikhoannganhangModel.loadById(id);
//   if (rows.length === 0) {
//     res.status(204).end();
//   } else {
//     res.json(rows[0]);
//   }
// })

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

// router.delete('/:id', async (req, res) => {
//   if (isNaN(req.params.id)) {
//     throw createError(400, 'Invalid id.');
//   }

//   const rs = await taikhoannganhangModel.del(req.params.id);
//   res.json(rs);
// })



/**
 * đổi password
 * body: {
 *      "passwordOld": "",
 *      "password": ""
 *    }
 * 
 */
router.patch('/security', async (req, res) => {
  const userId = res.locals.token.userId;
  if (isNaN(userId)) {
    throw createError(401, 'Invalid id.');
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "password is required" });
  }

  try{
    const rs = await auth.patchPassword(userId, req.body);
    console.log(rs);
    if(rs == opts.STATUS_PASSWORD.SUCCESS){
      logger.info("userId has changed password: ", userId);
      res.status(200).json({
        message: "success"
      }).end();
    }
    else if (rs == opts.STATUS_PASSWORD.NEW_PWD_IS_LIKE_OLD_PWD){
      res.status(200).json({ 
        message: "failed"
      }).end();
    }
    else if (rs == opts.STATUS_PASSWORD.WRONG_PWD){
      res.status(200).json({
        message: "wrong password"
      }).end();
    }
    else{
      res.status(403).json({
        message: "Forbidden"
      }).end();
    }
  
  }catch(err) {
    logger.error(err);
    res.status(500);
    res.end('View error log on console.');
  }
});


router.patch('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    throw createError(400, 'Invalid id.');
  }

  const rs = await taikhoannganhangModel.patch(req.params.id, req.body);
  res.json(rs);
})


module.exports = router;