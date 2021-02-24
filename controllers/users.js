const { request, response } = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const usersGet = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const { total, users } = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const usersPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    if(password) {
        // encrypt password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.json({
       user
    });
}

const usersPost = async(req = request, res = response) => {

    const {name, email, password, role} = req.body;
    const user = new User({ name, email, password, role });
    
    // encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.status(201).json({
        user
    });
}

const usersDelete = async(req = request, res = response) => {
    const { id } = req.params;

    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json({
        user
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