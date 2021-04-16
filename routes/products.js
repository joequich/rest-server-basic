const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/products');

const { existProductById } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// get all categories - public
router.get('/', getProducts);

// get a single category by id - public
router.get('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existProductById),
    validateFields,
], getProduct);

// create category - private - anyone with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createProduct);

// update - private - anyone with a valid token
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], updateProduct);

// delete a category - admin
router.delete('/:id', [
    validateJWT, 
    isAdminRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], deleteProduct);

module.exports = router;