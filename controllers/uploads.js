const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require('../models')

const loadFile = async(req = request, res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'imgs');
        res.json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async(req = request, res = response) => {
    const { id, collection } = req.params;
    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msd: `Id does not exist ${id}`
                });
            }
            break;
        case 'products':
            modelo = await Product.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msd: `Id does not exist ${id}`
                });
            }
            break;
        default:
            res.status(500).json({
                msg: 'I forgot to make this search.'
            });
    }

    /**
     * Clean previous images
     */
    if(modelo.img) {
        const imagePath = path.join(__dirname, '../uploads', collection, modelo.img);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    modelo.img = name;

    await modelo.save();

    res.json(modelo);

}

const showImage = async(req = request, res = response) => {
    const { id, collection } = req.params;
    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msd: `Id does not exist ${id}`
                });
            }
            break;
        case 'products':
            modelo = await Product.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msd: `Id does not exist ${id}`
                });
            }
            break;
        default:
            res.status(500).json({
                msg: 'I forgot to make this search.'
            });
    }

    /**
     * Clean previous images
     */
    if(modelo.img) {
        const imagePath = path.join(__dirname, '../uploads', collection, modelo.img);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    res.json({ msg: 'Missing place holder' });
}

module.exports = {
    loadFile,
    updateImage,
    showImage
}