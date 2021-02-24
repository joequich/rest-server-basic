
const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if(!existRole) {
        throw new Error(`The role ${role} is not registered in the DB`);
    }
}

// verify if the email exists
const emailExist = async(email = '') => {
    const existEmail = await User.findOne({ email });
    if(existEmail) {
        throw new Error(`The email ${email} already exists`);
    }
}

const existUserById = async(id) => {
    const existUser = await User.findById(id);
    if(!existUser) { 
        throw new Error(`Id does not exist ${id}`);
    }
}

module.exports = {
    isRoleValid,
    emailExist,
    existUserById
}