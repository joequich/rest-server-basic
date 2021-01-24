const express = require('express');
const _ = require('underscore');

const { verifyToken } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');

/**
 * Get Products
 */

app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    Product.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            Product.countDocuments((err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                });
            });
        });
});

/**
 * Get Products by id
 */

app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

/**
 * Search products
 */

app.get('/product/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, products) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            products
        });
    });
});


/**
 * Create a new Product
 */

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available:  body.available,
        category: body.category, 
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });
    });
});

/**
 * Update a Product
 */

app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'available', 'category']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });

    });
});

/**
 * Delete a Product
 */

app.delete('/product/:id', verifyToken, function (req, res) {
    let id = req.params.id;
    let available = { available: false };

    Product.findByIdAndUpdate(id, available, { new: true }, (err, productDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDeleted,
            message: 'Product deleted'
        });
    });

});


module.exports = app;