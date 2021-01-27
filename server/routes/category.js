const express = require('express');

let { verifyToken, verifyRole_Admin } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {
    Category.find()
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                categories
            });
        });
});

app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            category: categoryDB
        });
    });
});

app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let descCategory = {
        description: req.body.description
    }

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });
});

app.delete('/category/:id', [verifyToken, verifyRole_Admin], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deletedCategory) {
            return res.status(400).json({
                ok: false,
                err: 'Category not found'
            });
        }

        res.json({
            ok: true,
            message: 'Category deleted'
        });
    });
});

module.exports = app;