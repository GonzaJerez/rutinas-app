const {Router} = require('express');
const { check } = require( 'express-validator' );
const { getWorkouts, getWorkout, postWorkout, putWorkout, deleteWorkout } = require( '../controllers/workouts' );
const { validateFields, existWorkoutWithSameName } = require( '../middlewares' );

const router = Router();


router.get('/', getWorkouts)

router.get('/:id',[
    check('id', 'No es un id válido de Mongo').isMongoId(),
    validateFields
], getWorkout)

router.post('/',[
    check('name', 'El nombre del ejercicio es obligatorio').notEmpty(),
    check('muscle', 'El músculo es obligatorio').notEmpty(),
    existWorkoutWithSameName,
    validateFields
], postWorkout)

router.put('/:id',[
    check('id', 'No es un id válido de Mongo').isMongoId(),
    existWorkoutWithSameName,
    validateFields
], putWorkout)

router.delete('/:id',[
    check('id', 'No es un id válido de Mongo').isMongoId(),
    validateFields
], deleteWorkout)



module.exports = router;