const {Router} = require('express');
const { getMovements, getMovement } = require( '../controllers/movements' );
const { validateJWT } = require( '../middlewares' );

const router = Router();

router.get('/',[
    validateJWT,
], getMovements)

router.get('/:id',[
    validateJWT
], getMovement)


module.exports = router;