const {Router} = require('express');
const { check } = require( 'express-validator' );
const { validateFields, validateJWT, routineOwnerUser, validateNumRepsSets } = require( '../middlewares' );
const { postCombinedWorkouts, deleteCombinedWorkout, updateCombinedWorkouts } = require( '../controllers/combinedWorkouts' );

const router = Router();


router.post('/:idRoutine/:idDay',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    routineOwnerUser,
    validateNumRepsSets,
    validateFields
], postCombinedWorkouts)


router.put('/:idRoutine/:idDay/:idCombinedWorkouts',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idCombinedWorkouts', 'El id del combinedWorkouts es requerido').notEmpty(),
    routineOwnerUser,
    validateFields
], updateCombinedWorkouts)

router.patch('/:idRoutine/:idDay/:idCombinedWorkouts',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idCombinedWorkouts', 'El id del combinedWorkouts es requerido').notEmpty(),
    routineOwnerUser,
    validateFields
], updateCombinedWorkouts)

router.delete('/:idRoutine/:idDay/:idCombinedWorkouts',[
    validateJWT,
    check('idRoutine', 'El id de la rutina es requerido').notEmpty(),
    check('idDay', 'El id del día es requerido').notEmpty(),
    check('idCombinedWorkouts', 'El id del combinedWorkouts es requerido').notEmpty(),
    routineOwnerUser,
    validateFields
], deleteCombinedWorkout)


module.exports = router;