const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { createCategory } = require('../controllers/categories');

const { validateFields, validateJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// get all categories - public
router.get('/', (req = request, res = response) => {
    res.json('get');
});

// get a single category by id - public
router.get('/:id', (req = request, res = response) => {
    res.json('get - id');
});

// create category - private - anyone with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
], createCategory);

// update - private - anyone with a valid token
router.put('/:id', (req = request, res = response) => {
    res.json('put');
});

// delete a category - admin
router.delete('/:id', (req = request, res = response) => {
    res.json('delete');
});

module.exports = router;