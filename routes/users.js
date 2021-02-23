const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isRoleValid } = require('../helpers/db-validators');

const { usersGet, usersPost, usersPut, usersDelete, usersPatch } = require('../controllers/users');

const router = Router();

router.get('/', usersGet);
router.put('/', usersPut);
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be more than 6 characters long').isLength({min: 6}),
    check('email', 'Email is not valid').isEmail(),
    check('role').custom(isRoleValid),
    validateFields
],usersPost);
router.delete('/', usersDelete);
router.patch('/', usersPatch);


module.exports = router;