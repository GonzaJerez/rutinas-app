const {Router} = require('express');
const { check } = require( 'express-validator' );

const { login, renewToken, googleSignIn } = require( '../controllers/auth' );
const { validateJWT, validateFields } = require( '../middlewares/' );

const router = Router();


router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login)

router.post('/google',[
    check('idToken', 'El idToken es obligatorio').not().isEmpty(),
    validateFields
], googleSignIn)

router.get('/', validateJWT, renewToken );

module.exports = router;