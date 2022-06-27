const {Router} = require('express');
const { check } = require( 'express-validator' );

const { emailExist, userExistById } = require( '../helpers/db-validation' );
const { validateFields, validateJWT } = require('../middlewares')
const {roles} = require('../types/roles')

const { 
    getUsers, 
    putUser,
    postUsers, 
    deleteUser,
    getUser
} = require( '../controllers/users' );

const router = Router();


router.get('/', getUsers)

router.get('/:id',[
    check('id', 'El id no es válido').isMongoId(),
    validateFields
], getUser)

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    // check('email').custom(emailExist),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min:6}),
    // check('role', 'No es un role válido').isIn([roles.admin, roles.user]),
    validateFields
], postUsers)

router.put('/:id',[
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( userExistById ),
    validateFields
],putUser)


router.delete('/:id',[
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( userExistById ),
    validateFields
], deleteUser)

module.exports = router;