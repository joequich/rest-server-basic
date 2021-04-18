const { request, response } = require("express");
const { uploadFile } = require("../helpers");

const loadFile = async(req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ msg: 'No files were uploaded.' });
        return;
    }

    try {
        const name = await uploadFile(req.files, undefined, 'imgs');
        res.json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

module.exports = {
    loadFile
}