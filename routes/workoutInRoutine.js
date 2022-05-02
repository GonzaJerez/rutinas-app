const {Router} = require('express');
const { check } = require( 'express-validator' );
const { postWorkoutInRoutine, putWorkoutInRoutine, deleteWorkoutInRoutine } = require( '../controllers/workoutInRoutine' );
const { validateJWT, validateFields, dayOwnerUser, existWorkout, workoutOwnerUser } = require( '../middlewares' );
const { tools } = require( '../types/tools' );

const router = Router();

// Si es necesario hago las rutas para obtener los ejercicios en rutina del usuario que hace la petición + rutina especificada

// Ruta para crear ejercicio en rutina
router.post('/:idDay',[
    validateJWT,
    dayOwnerUser,
    check('idDay', 'El idDay no es un id válido de Mongo'),
    check('tool', `Propiedad tool no es una herramienta válida - ${tools}`).isIn(tools),
    check('workout', 'El workout es obligatorio').notEmpty(),
    check('workout', 'workout no es un id válido de Mongo').isMongoId(),
    validateFields,
    // validar workout existente
    existWorkout,
], postWorkoutInRoutine)

// Ruta para actualizar ejercicio en rutina - lo unico q se podria actualizar el ejercicio en rutina es la tool
router.put('/:idWorkoutInRoutine',[
    validateJWT,
    check('tool', 'La tool en obligatoria').notEmpty(),
    check('tool', `Propiedad tool no es una herramienta válida - ${tools}`).isIn(tools),
    check('idWorkoutInRoutine', 'No es un id válido de Mongo'),
    validateFields,
    workoutOwnerUser
], putWorkoutInRoutine)

// Ruta para eliminar ejercicio en rutina
router.delete('/:idWorkoutInRoutine',[
    validateJWT,
    check('idWorkoutInRoutine', 'No es un id válido de Mongo'),
    validateFields,
    workoutOwnerUser
], deleteWorkoutInRoutine)

module.exports = router;