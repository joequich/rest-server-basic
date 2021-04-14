const { request, response } = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        // verify if email exist
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects - email'
            });
        }

        // if user is active
        if(!user.status) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects'
            });
        }

        // verify password
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'User / Password arent\' corrects - password'
            });
        }

        // generate JWT
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

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;
    
    try {
        const { name, email, img } = await googleVerify(id_token);
    
        let user = await User.findOne({ email });
    
        if(!user) {
            // create new user from google
            const data = {
                name,
                email,
                password: ':lol',
                img,
                google: true
            }
    
            user = new User(data);
            await user.save();
        }
    
        if(!user.status) {
            res.status(401).json({
                msg: 'Contact the administrator, user blocked'
            });
        }
    
        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Google token is not valid'
        });      
    }
}

module.exports = {
    login,
    googleSignIn
}