const { request, response } = require("express");
const { Product } = require('../models');

// getProducts - paginated - total - populate
const getProducts = async(req = request, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('user', 'name')
        .populate('category', 'name')
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        products
    })
}

// getProduct - populate {}
const getProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

    res.json({
        product
    });
}

const createProduct = async(req = request, res = response) => {
    const { status, user, ...body } = req.body;
    const name = body.name.toUpperCase();
    const productDB = await Product.findOne({ name });

    if(productDB) {
        return res.status(400).json({
            msg: `The Product ${ productDB.name }, already exists`
        });
    }

    // generate the data to be saved
    const data = {
        ...body,
        name,
        user: req.user._id
    }

    const product = new Product(data);
    // save DB
    await product.save();

    res.status(201).json(product);
}

// updateProduct
const updateProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, {new: true});

    res.json({
        product
    });
}

// deleteProduct - status:false
const deleteProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false }, {new: true});

    res.json({
        product
    });
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}