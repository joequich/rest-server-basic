const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');

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

    let nameCut = file.name.match(/([\s\S]+)*\.(\w+)$/);
    let extension = nameCut[2];
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
    let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

    let uploadPath = `uploads/${type}/${nameFile}`;
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.send('File uploaded!');
    });
});

module.exports = app;


