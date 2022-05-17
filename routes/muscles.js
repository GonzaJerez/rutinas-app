const {Router} = require('express');
const { check } = require( 'express-validator' );
const { getMuscles, postMuscle, deleteMuscle, putMuscle } = require( '../controllers/muscles' );
const { validateJWT, existMuscleWithSameName, validateFields } = require( '../middlewares' );

const router = Router();

// Falta validación para que solo pueda modificar el admin

router.get('/', getMuscles)
// router.get('/:id')
router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    existMuscleWithSameName,
    validateFields,
], postMuscle)
router.put('/:id',[
    validateJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    existMuscleWithSameName,
    validateFields
], putMuscle)
router.delete('/:id', [
    validateJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    validateFields
],deleteMuscle)

module.exports = router;