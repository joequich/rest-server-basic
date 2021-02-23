const { request, response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const User = require('../models/user');

const usersGet = (req, res = response) => {
    res.json({
        message: 'get API - controller'
    });
}

const usersPut = (req, res = response) => {
    res.json({
        message: 'put API - controller'
    });

    // let from = req.query.from || 0;
    // from = Number(from);
    // let limit = req.query.limit || 5;
    // limit = Number(limit);

    // User.find({ status: true }, 'name email role img status google')
    //     .skip(from)
    //     .limit(limit)
    //     .exec((err, users) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         User.countDocuments({ status: true }, (err, count) => {
    //             res.json({
    //                 ok: true,
    //                 count,
    //                 users
    //             });
    //         });

    //     });
}

const usersPost = async(req = request, res = response) => {

    const {name, email, password, role} = req.body;
    const user = new User({ name, email, password, role });
    
    // verify if the email exists
    const existEmail = await User.findOne({ email });
    
    if(existEmail) {
        return res.status(400).json({
            message: 'Email already exists'
        });
    }
    
    // encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // await user.save((err, userDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             err
    //         });
    //     }

    //     res.status(201).json({
    //         user: userDB
    //     });
    // });
    await user.save();

    res.status(201).json({
        user
    });
}

const usersDelete = (req, res = response) => {
    res.json({
        message: 'delete API - controller'
    });
}

const usersPatch= (req, res = response) => {
    res.json({
        message: 'patch API - controller'
    });
}


module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}