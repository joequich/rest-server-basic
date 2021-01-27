const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { verifyToken, verifyRole_Admin } = require('../middlewares/authentication');
const app = express();

app.get('/user', verifyToken, function (req, res) {

    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role img status google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                });
            });

        });
});

app.post('/user', [verifyToken, verifyRole_Admin], function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [verifyToken, verifyRole_Admin], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'img', 'email', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [verifyToken, verifyRole_Admin], function (req, res) {
    let id = req.params.id;
    let status = { status: false };

    User.findByIdAndUpdate(id, status, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        });
    });

    // User.findByIdAndRemove( id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!userDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: 'User not found'
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     })
    // });

});

module.exports = app;