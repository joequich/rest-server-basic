const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    let validTypes = ['products','users'];
    if(validTypes.indexOf(type) === -1) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Allowed types are ${validTypes.join(', ')}`
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;

    let cutName = file.name.match(/([\s\S]+)*\.(\w+)$/);
    let extension = cutName[2];
    let validExtensions = ['png','jpg','gif','jpeg'];

    if(validExtensions.indexOf(extension) === -1) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Allowed extensions are ${validExtensions.join(', ')}`,
                ext: extension
            }
        });
    }

    // Change file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`

    let uploadPath = `uploads/${type}/${fileName}`;
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

            if(type === 'users') {
                userImage(id,res,fileName);
            } else {
                productImage(id,res,fileName);
            }
    });
});

function userImage(id, res, fileName) {
    User.findById(id, (err, userDB) => {
        if(err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;

        userDB.save((err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser,
                img: fileName
            });
        });

    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if(err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productDB) {
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err, savedProduct) => {
            res.json({
                ok: true,
                product: savedProduct,
                img: fileName
            });
        });
    });
    
}

function deleteFile(imageName, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);
    if(fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}


module.exports = app;


