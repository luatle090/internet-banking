const express = require('express');
const createError = require('http-errors');
const nhanVienModel = require('../models/nhanvien.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rows = await nhanVienModel.all();
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end('View error log on console.');
    }
})

router.get('/:id', async (req, res) => {
    if (isNaN(req.params.id)) {
        throw createError(400, 'Invalid id.');
    }

    const id = req.params.id || -1;
    try {
        const rows = await nhanVienModel.loadById(id);
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
    //check body

    const results = await nhanVienModel.add(req.body);
    try {
        const ret = {
            id: results.insertId,
            ...req.body
        }
        res.status(201).json(ret);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end('View error log on console.');
    }
})

router.delete('/:id', async (req, res) => {
    if (isNaN(req.params.id)) {
        throw createError(400, 'Invalid id.');
    }

    try {
        const rs = await nhanVienModel.del(req.params.id);
        res.json(rs);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end('View error log on console.');
    }
})
router.get('/getlist/:page', async (req, res, next) => {
    const curPage = req.params.page || 1;
    const Email = req.query.Email || "";
    const HoTen = req.query.HoTen || "";
    const Username = req.query.Username || "";
    const Id = req.query.Id || "";
    console.log(HoTen)
    const rows = await nhanVienModel.getlist(Email, HoTen, Username, Id, curPage);
    res.json(rows);
})
router.patch('/:id', async (req, res) => {
    if (isNaN(req.params.id)) {
        throw createError(400, 'Invalid id.');
    }
    try {
        const rs = await nhanVienModel.patch(req.params.id, req.body);
        res.json(rs);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end('View error log on console.');
    }
})

module.exports = router;