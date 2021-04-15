const { request, response } = require("express");
const { Category } = require('../models');

// getCategories - paginated - total - populate
const getCategories = async(req = request, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate('user')
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        categories
    })
}

// getCategory - populate {}
const getCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate('user');

    if(!category) {
        return res.status(401).json({
            msg: 'Category not found'
        });
    }

    res.json({
        category
    });
}

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

    console.log(data);
    const category = new Category(data);
    console.log(category);
    // save DB
    await category.save();

    res.status(201).json(category);
}

// updateCategory
const updateCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(id, { name: name.toUpperCase() });

    if(!category) {
        return res.status(401).json({
            msg: 'Category not found'
        });
    }

    res.json({
        category
    });
}

// deleteCategory - status:false
const deleteCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false });

    if(!category) {
        return res.status(401).json({
            msg: 'Category not found'
        });
    }

    res.json({
        category
    });
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}