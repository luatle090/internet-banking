const express = require('express');
const createError = require('http-errors');
const taiKhoanModel = require('../models/taikhoannganhang.model');
const logger = require('log4js').getLogger();
const doiTacModel = require('../models/doitac.model');
const opts = require('../utils/opts');
const axios = require('axios');
const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const router = express.Router();

var verifyAccessToken = require('../models/auth.model').verifyAccessToken;

/**
 * API Truy vấn thông tin tài khoản
 * 
 * 
 */
router.post('/thongtin', async (req, res, next) => {
    if (!req.body.soTK) {
        throw createError(400, 'Invalid soTK.');
    }
    if (!req.body.partnerCode) {
        throw createError(400, 'Invalid partnerCode.');
    }
    if (!req.body.timestamp) {
        throw createError(400, 'Invalid thoi gian.');
    }
    if (!req.body.checksum) {
        throw createError(400, 'Invalid checksum.');
    }

    const partnerCode = req.body.partnerCode;
    let checksum = req.body.checksum;
    const ngayCK = req.body.timestamp;

    //check timesamp
    let date = new Date();
    date.setMinutes(date.getMinutes() - opts.API.MINUTES);
    if(ngayCK > Date.now() || ngayCK < date.getTime()){
        throw createError(403, 'Thoi gian het han');
    }

    //check partnerCode
    const rowsDoiTac = await doiTacModel.loadByCode(partnerCode);
    if(rowsDoiTac.length === 0){
      throw createError(404, 'Ngan hang doi tac not found');  
    }


    // const obj = {
    //    soTK: req.body.soTK,
    //    timesamp: req.body.timesamp,
    //    partnerCode: partnerCode,
    //    secretKey: opts.SIGNATURE.SECRET_KEY,
    // }

    const obj = {
        soTK: req.body.soTK,
        timestamp: req.body.timestamp,
        partnerCode: partnerCode,
        secretKey: opts.SIGNATURE.SECRET_KEY,
    }

    //Serialize JavaScript object into JSON string
    const text = JSON.stringify(obj);

    const hashDigest = CryptoJS.SHA256(text);
    console.log(hashDigest.toString(CryptoJS.enc.Hex));
    

    try {
        if(checksum == hashDigest.toString(CryptoJS.enc.Hex)) {
            const rows = await taiKhoanModel.getInfoBySoTK(req.body.soTK);
            if (rows.length === 0) {
                res.status(204).end();
            }
            else {
                res.status(200).json({
                    taikhoan: rows[0]
                });
            }
        }
        else {
            res.status(403).json({
                message: "Thong tin bi sua doi",
            }).end();
        }
      } catch (error) {
        logger.error(err);
        res.status(500);
        res.end('View error log on console.');
      }
});

/**
 * API Lấy thông tin tai khoan cua ngan hang doi tac
 * 
 * need testing
 */
router.post('/', async (req, res, next) => {
    if (!req.body.soTK) {
        throw createError(400, 'Invalid soTK.');
    }
    if (!req.body.partnerCode) {
        throw createError(400, 'Invalid partnerCode.');
    }

    
    const partnerCode = req.body.partnerCode;

    //Date time
    let date = moment().format("YYYY-MM-DD HH:mm:ss");

    //check partnerCode
    const rowsDoiTac = await doiTacModel.loadByCode(partnerCode);
    if(rowsDoiTac.length === 0){
      throw createError(404, 'Ngan hang doi tac not found');  
    }

    const data = {
        SoTaiKhoan: req.body.soTK,
        time: date,
        code: partnerCode,
    }

    //gen hash
    const c = code + now;
    const checksum = bcrypt.hashSync(c, 8);

    try {
        data.hash = checksum;
        const url = rowsDoiTac[0].api+"/api/information";
        const resAPI = await axios.post(url, data);
        if(resAPI.status === 200){
            const dataResAPI = {
                hoTen: resAPI.data.HoVaTen  
            }
            res.status(200).json({
                taikhoan: dataResAPI
            }).end();
        }
      } catch (error) {
        logger.error(err);
        res.status(500);
        res.end('View error log on console.');
      }
});

module.exports = router;