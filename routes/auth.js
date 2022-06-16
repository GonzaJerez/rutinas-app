const {Router} = require('express');
const { check } = require( 'express-validator' );

const { login, renewToken, googleSignIn, sendEmail, securityCode, renewPassword } = require( '../controllers/auth' );
const { validateJWT, validateFields } = require( '../middlewares/' );

const router = Router();


router.post('/login',[
    check('email', 'El correo es obligatorio').notEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
], login)

router.post('/google',[
    check('idToken', 'El idToken es obligatorio').notEmpty(),
    validateFields
], googleSignIn)

router.get('/', validateJWT, renewToken );

router.post('/sendEmail',[
    check('emailUser','El correo es necesario').notEmpty(),
    check('emailUser','Correo inválido').isEmail(),
    validateFields
], sendEmail)

router.post('/securityCode',[
    check('emailUser','El correo es necesario').notEmpty(),
    check('emailUser','Correo inválido').isEmail(),
    check('securityCode', 'No se recibió código de seguridad').notEmpty(),
    check('securityCode', 'Código inválido').isLength({min:6,max:6}),
], securityCode)

router.post('/renewPassword',[
    check('emailUser','El correo es necesario').notEmpty(),
    check('emailUser','Correo inválido').isEmail(),
    check('newPassword', 'La contraseña es obligatoria').notEmpty(),
    check('newPassword', 'La contraseña debe tener al menos 6 caracteres').isLength({min:6}),
], renewPassword)

module.exports = router;