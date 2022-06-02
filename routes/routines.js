const {Router} = require('express');
const { check } = require( 'express-validator' );
const { getRoutines, getRoutine, postRoutine, putRoutine, deleteRoutine, copyRoutine } = require( '../controllers/routines' );
const { validateFields, validateJWT, routineOwnerUser, existRoutineWithSameName, validateNumRepsSets, validateWorkout, validateTool  } = require( '../middlewares' );

const router = Router();

router.get('/',[
    validateJWT,
], getRoutines)

router.get('/:idRoutine',[
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    validateFields
], getRoutine)

router.post('/',[
    validateJWT,
    check('name', 'El name es obligatorio').notEmpty(),
    check('img', 'La imagen es obligatoria').notEmpty(),
    check('typeUnit', 'No es una unidad de medida permitida').isIn(['kg','lb', 'oz']),
    existRoutineWithSameName,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields
], postRoutine)

router.put('/:idRoutine', [
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    existRoutineWithSameName,
    validateNumRepsSets,
    validateWorkout,
    validateTool,
    validateFields,
    routineOwnerUser,
],putRoutine)

router.delete('/:idRoutine', [
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    validateFields,
    routineOwnerUser,
], deleteRoutine)

router.post('/copy/:idRoutine',[
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    validateFields,
    routineOwnerUser,
], copyRoutine)

module.exports = router;