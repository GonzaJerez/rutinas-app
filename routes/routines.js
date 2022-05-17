const {Router} = require('express');
const { check } = require( 'express-validator' );
const { getRoutines, getRoutine, postRoutine, putRoutine, deleteRoutine } = require( '../controllers/routines' );
const { validateFields, validateJWT, routineOwnerUser, existRoutineWithSameName,  } = require( '../middlewares' );

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
    // check('days', 'El campo days es obligatorio').notEmpty(),
    // check('days', 'La cantidad de dias en rutina no puede ser superior a los 7 dias de la semana').isFloat({max: 7}),
    check('typeUnit', 'No es una unidad de medida permitida').isIn(['kg','lb', 'oz']),
    existRoutineWithSameName,
    validateFields
], postRoutine)

router.put('/:idRoutine', [
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    existRoutineWithSameName,
    validateFields,
    routineOwnerUser,
],putRoutine)

router.delete('/:idRoutine', [
    validateJWT,
    check('idRoutine', 'El id no es reconocido como un id de Mongo').isMongoId(),
    validateFields,
    routineOwnerUser,
], deleteRoutine)



module.exports = router;