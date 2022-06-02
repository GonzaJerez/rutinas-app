const {Router} = require('express');
const { check } = require( 'express-validator' );
const { postWorkoutInRoutine, putWorkoutInRoutine, deleteWorkoutInRoutine } = require( '../controllers/workoutInRoutine' );
const { validateJWT, validateFields, routineOwnerUser, validateNumRepsSets, validateWorkout, validateTool } = require( '../middlewares' );
const { tools } = require( '../types/tools' );

const router = Router();

router.post('/:idRoutine/:idDay/:idCombinedWorkout',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idRoutine', 'idRoutine no es un id válido de Mongo').isMongoId(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idDay', 'idDay no es un id válido de Mongo').isMongoId(),
    check('idCombinedWorkout', 'El id del combinedWorkout es requerido').notEmpty(),
    check('idCombinedWorkout', 'idCombinedWorkout no es un id válido de Mongo').isMongoId(),
    routineOwnerUser,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields
], postWorkoutInRoutine)

router.put('/:idRoutine/:idDay/:idCombinedWorkout/:idWorkoutInRoutine', [
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idRoutine', 'idRoutine no es un id válido de Mongo').isMongoId(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idDay', 'idDay no es un id válido de Mongo').isMongoId(),
    check('idCombinedWorkout', 'El id del combinedWorkout es requerido').notEmpty(),
    check('idCombinedWorkout', 'idCombinedWorkout no es un id válido de Mongo').isMongoId(),
    check('idWorkoutInRoutine', 'El id del ejercicio es requerido').notEmpty(),
    check('idWorkoutInRoutine', 'idWorkoutInRoutine no es un id válido de Mongo').isMongoId(),
    routineOwnerUser,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields
],putWorkoutInRoutine)

router.delete('/:idRoutine/:idDay/:idCombinedWorkout/:idWorkoutInRoutine',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idRoutine', 'idRoutine no es un id válido de Mongo').isMongoId(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idDay', 'idDay no es un id válido de Mongo').isMongoId(),
    check('idCombinedWorkout', 'El id del combinedWorkout es requerido').notEmpty(),
    check('idCombinedWorkout', 'idCombinedWorkout no es un id válido de Mongo').isMongoId(),
    check('idWorkoutInRoutine', 'El id del ejercicio es requerido').notEmpty(),
    check('idWorkoutInRoutine', 'idWorkoutInRoutine no es un id válido de Mongo').isMongoId(),
    routineOwnerUser,
    validateFields
], deleteWorkoutInRoutine)

module.exports = router;