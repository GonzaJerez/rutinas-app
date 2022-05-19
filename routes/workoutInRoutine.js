const {Router} = require('express');
const { check } = require( 'express-validator' );
const { postWorkoutInRoutine, putWorkoutInRoutine, deleteWorkoutInRoutine } = require( '../controllers/workoutInRoutine' );
const { validateJWT, validateFields, routineOwnerUser, validateNumRepsSets, validateWorkout, validateTool } = require( '../middlewares' );
const { tools } = require( '../types/tools' );

const router = Router();

router.post('/:idRoutine/:idDay',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    routineOwnerUser,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields
], postWorkoutInRoutine)

router.put('/:idRoutine/:idDay/:idWorkoutInRoutine', [
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idWorkoutInRoutine', 'El id del ejercicio es requerido').notEmpty(),
    routineOwnerUser,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields
],putWorkoutInRoutine)

router.delete('/:idRoutine/:idDay/:idWorkoutInRoutine',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idWorkoutInRoutine', 'El id del ejercicio es requerido').notEmpty(),
    routineOwnerUser,
    validateFields
], deleteWorkoutInRoutine)

module.exports = router;