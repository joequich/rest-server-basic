const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateUploadFile } = require('../middlewares')
const { loadFile, updateImageCloudinary, showImage } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');

const router = Router();

router.post('/', validateUploadFile, loadFile);
router.put('/:collection/:id', [
    validateUploadFile,
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users','products'])),
    validateFields
], updateImageCloudinary);
router.get('/:collection/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users','products'])),
    validateFields
], showImage);

module.exports = router;