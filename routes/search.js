const {Router} = require('express');
const { check } = require( 'express-validator' );
const { searchInCollection } = require( '../controllers/search' );
const { validateJWT, validateFields } = require( '../middlewares' );

const router = Router();


router.get('/:collection/:word',[
    validateJWT,
    check('collection', 'La coleccion es requerida').notEmpty(),
    validateFields
], searchInCollection)

module.exports = router;