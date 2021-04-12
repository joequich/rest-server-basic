const { Router } = require('express');
const { check } = require('express-validator');
const { isRoleValid, emailExist, existUserById } = require('../helpers/db-validators');

const { usersGet, usersPost, usersPut, usersDelete, usersPatch } = require('../controllers/users');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', usersGet);
router.put('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(isRoleValid),
    validateFields
], usersPut);
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be more than 6 characters long').isLength({min: 6}),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(emailExist),
    check('role').custom(isRoleValid),
    validateFields
],usersPost);
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existUserById),
    validateFields
], usersDelete);

router.patch('/', usersPatch);

module.exports = router;