const {Router} = require('express');
const { check } = require( 'express-validator' );
const { validateFields, validateJWT, routineOwnerUser, validateNumRepsSets } = require( '../middlewares' );
const { deleteDay, postDay} = require('../controllers/routineDays')

const router = Router();


router.post('/:idRoutine',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    routineOwnerUser,
    validateNumRepsSets,
    validateFields
], postDay)

router.delete('/:idRoutine/:idDay',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    routineOwnerUser,
    validateFields
], deleteDay)


module.exports = router;