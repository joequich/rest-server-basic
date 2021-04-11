const { request, response } = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        //verify if email exist
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects - email'
            });
        }

        //if user is active
        if(!user.status) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects - status: false'
            });
        }

        //verify password
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects - password'
            });
        }

        //generate JWT
        const token = await generateJWT(user.id);
        
        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contact the administrator'
        });
    }
}

module.exports = {
    login
}