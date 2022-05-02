const {Router} = require('express');
const { check } = require( 'express-validator' );

const { login, renewToken } = require( '../controllers/auth' );
const { validateJWT, validateFields } = require( '../middlewares/' );

const router = Router();


router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login)

// router.post('/google',[
//     check('id_token', 'El id_token es obligatorio').not().isEmpty(),
//     validarCampos
// ], googleSignIn)

router.get('/', validateJWT, renewToken );

module.exports = router;