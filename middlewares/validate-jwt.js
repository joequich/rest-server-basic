const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req = request, res = response, next) => {
    const token = req.header('x-token');
    console.log(token);

    if(!token) {
        return res.status(401).json({
            msg: 'No token was found in request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETKEY);
        req.uid = uid;
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