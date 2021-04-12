const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No token was found in request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETKEY);
        
        // read the user that corresponds to the uid
        const user = await User.findById(uid);

        if(!user) {
            return res.status(401).json({
                msg: 'Invalid token - user doesn\'t exist'
            });
        }

        // verify if the uid have true status
        if(!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - user have status: false'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });       
    }
}

module.exports = {
    validateJWT
}