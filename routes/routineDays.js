const {Router} = require('express');
const { check } = require( 'express-validator' );
const { postDay, putDay, deleteDay, getDays } = require( '../controllers/routineDays' );
const { validateFields, validateJWT, routineOwnerUser, dayOwnerUser } = require( '../middlewares' );

const router = Router();

router.get('/:idDay',[
    validateJWT,
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idDay', 'El id del día recibido no es un id de Mongo').isMongoId(),
    validateFields
], getDays)

router.post('/:idRoutine',[
    validateJWT,
    routineOwnerUser,
    check('idRoutine', 'El id no es un id válido de Mongo').isMongoId(),
    validateFields
], postDay)

/* router.put('/dayWorkout/:idDay',[
    validateJWT,
    dayOwnerUser,
    check('idDay', 'El id no es un id válido de Mongo').isMongoId(),
    // check('numMuscles', 'La prop numMuscles es obligatoria').notEmpty(),
    // check('numMuscles', 'La prop numMuscles debe ser un número').isNumeric(),
    validateFields
], putDay) */

router.delete('/:idDay',[
    validateJWT,
    dayOwnerUser,
    check('idDay', 'El id no es un id válido de Mongo').isMongoId(),
    validateFields
], deleteDay)


module.exports = router;