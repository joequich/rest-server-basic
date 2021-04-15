const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const { validateFields, validateJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// get all categories - public
router.get('/', getCategories);

// get a single category by id - public
router.get('/:id', getCategory);

// create category - private - anyone with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createCategory);

// update - private - anyone with a valid token
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateCategory);

// delete a category - admin
router.delete('/:id', [
    validateJWT, 
    isAdminRole
], deleteCategory);

module.exports = router;