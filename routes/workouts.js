const {Router} = require('express');
const { check } = require( 'express-validator' );
const { getWorkouts, getWorkout, postWorkout, putWorkout, deleteWorkout } = require( '../controllers/workouts' );
const { muscleExistById } = require( '../helpers' );
const { validateFields, existWorkoutWithSameName, validateJWT } = require( '../middlewares' );

const router = Router();


router.get('/', getWorkouts)

router.get('/:id',[
    check('id', 'No es un id válido de Mongo').isMongoId(),
    validateFields
], getWorkout)

router.post('/',[
    validateJWT,
    check('name', 'El nombre del ejercicio es obligatorio').notEmpty(),
    check('muscle', 'El músculo es obligatorio').notEmpty(),
    check('muscle', 'El muscle debe ser un id de Mongo').isMongoId(),
    check('muscle').custom(muscleExistById),
    existWorkoutWithSameName,
    validateFields
], postWorkout)

router.put('/:id',[
    validateJWT,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    existWorkoutWithSameName,
    validateFields
], putWorkout)

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    validateFields
], deleteWorkout)



module.exports = router;