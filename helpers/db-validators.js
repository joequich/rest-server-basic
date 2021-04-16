
const Role = require('../models/role');
const User = require('../models/user');
const Product = require('../models/product');

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
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Id does not exist ${id}`);
    }
    const existUser = await User.findById(id);
    
    if(!existUser) { 
        throw new Error(`Id does not exist ${id}`);
    }
}

const existCategoryById = async(id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Id does not exist ${id}`);
    }
    const existCategory = await Category.findById(id);

    if(!existCategory) {
        throw new Error(`Id does not exist ${id}`);
    }
}

const existProductById = async(id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Id does not exist ${id}`);
    }
    const existProduct = await Product.findById(id);

    if(!existProduct) {
        throw new Error(`Id does not exist ${id}`);
    }
}

module.exports = {
    isRoleValid,
    emailExist,
    existUserById,
    existCategoryById,
    existProductById
}