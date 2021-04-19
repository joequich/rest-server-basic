const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
const { request, response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require('../models');


// const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// cloudinary.config({ 
//     cloud_name: CLOUDINARY_NAME, 
//     api_key: CLOUDINARY_API_KEY, 
//     api_secret: CLOUDINARY_API_SECRET
// });

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
        if (fs.existsSync(imagePath)) return res.sendFile(imagePath);
    }

    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    return res.sendFile(noImagePath);
}


const updateImageCloudinary = async(req = request, res = response) => {
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
        const nameArr = modelo.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'RestServer-NodeJS' });

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);

}

module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}