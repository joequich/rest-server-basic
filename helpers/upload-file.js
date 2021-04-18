const { v4: uuidv4 } = require('uuid');
const path = require('path');
const uploadFile = ( files,  validExtensions = ['png','jpg','gif','jpeg'], folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const cutName = file.name.match(/([\s\S]+)*\.(\w+)$/);
        const extension = cutName[2];
    
        if(!validExtensions.includes(extension)) {
            return reject(`This extension ${extension} is not allowed. - Allowed extensions are ${validExtensions}`);
        }
        
        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);
    
        file.mv(uploadPath, function(err) {
            if(err) return reject(err);
    
            resolve(nameTemp);
        });
    });
}

module.exports = {
    uploadFile
}