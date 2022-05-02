const {Router} = require('express');
const { check } = require( 'express-validator' );
const { postSetWorkout, putSetWorkout, deleteSetWorkout } = require( '../controllers/sets' );
const { validateJWT, workoutOwnerUser, validateFields, setOwnerUser } = require( '../middlewares' );

const router = Router();

router.post('/:idWorkoutInRoutine',[
    validateJWT,
    workoutOwnerUser,
    check('sets', 'La prop sets es obligatoria').notEmpty(),
    check('sets', 'La prop sets debe ser un array con todos los sets').isArray(),
    check('sets.*.numReps', 'El numReps debe ser un número').isNumeric(),
    validateFields
], postSetWorkout)

router.put('/:idSet', [
    validateJWT,
    setOwnerUser
],putSetWorkout)

router.delete('/:idSet',[
    validateJWT,
    setOwnerUser
],deleteSetWorkout)

module.exports = router;