const {Router} = require('express');
const { getImages, getImage } = require( '../controllers/routineImages' );
const { validateJWT } = require( '../middlewares' );

const router = Router();

// Obtener imgs de rutina
router.get('/', [
    validateJWT,
], getImages)

router.get('/:folder/:id', getImage)



module.exports = router;