const { request, response } = require("express");
const { Category } = require('../models');

const createCategory = async(req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if(categoryDB) {
        return res.status(400).json({
            msg: `The Category ${ categoryDB.name }, already exists`
        });
    }

    // generate the data to be saved
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);

    // save DB
    await category.save();

    res.status(201).json(category);
}

module.exports = {
    createCategory
}