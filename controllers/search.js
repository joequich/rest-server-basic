const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models')

const allowedCollections = [
    'categories',
    'products',
    'roles',
    'users'
]

const searchUsers = async(term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if(isMongoID) {
        const user = await User.findById(term);

        return res.json( { results: (user) ? [user] : [] });
    }

    const regex = new RegExp(term, 'i');
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json( { results: (users) ? [users] : [] });
}

const searchCategories = async(term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if(isMongoID) {
        const category = await Category.findById(term).populate('user', 'name');

        return res.json( { results: (category) ? [category] : [] });
    }

    const regex = new RegExp(term, 'i');
    const categories = await Category.find({ 
        name: regex,
        status: true
    })
    .populate('user', 'name');

    res.json( { results: (categories) ? categories : [] });
}

const searchProducts = async(term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if(isMongoID) {
        const product = await Product.findById(term).populate('user', 'name').populate('category', 'name');

        return res.json( { results: (product) ? [product] : [] });
    }
    
    const regex = new RegExp(term, 'i');
    const products = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ status: true }]
    })
    .populate('user', 'name')
    .populate('category', 'name');

    res.json( { results: (products) ? products : [] });
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params;

    if(!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Allowed collections are ${allowedCollections}`
        });
    }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'users':
            searchUsers(term, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'I forgot to make this search.'
            });
    }
}

module.exports = {
    search
}