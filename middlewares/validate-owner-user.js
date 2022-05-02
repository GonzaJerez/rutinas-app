const { Routine, DayWorkout, WorkoutInRoutine, SetWorkout } = require( "../models" );
const { roles } = require( "../types/roles" );

/**
 * Valida que la rutina que se quiere modificar sea del usuario que hace la petición
 */
const routineOwnerUser = async(req, res, next) => {
    const {_id: uid, role} = req.user;
    const {idRoutine} = req.params;

    if (!uid) {
        return res.status(400).json({
            msg: 'Se quiere validar usuario antes de validar token'
        })
    }

    const routine = await Routine.findById(idRoutine)

    if (!routine) {
        return res.status(400).json({
            msg: `No se encontro ninguna rutina con el id ${idRoutine}`
        })
    }

    if (routine.actualUser.toString() != uid.toString() && role !== roles.admin) {
        return res.status(400).json({
            msg: `Se está tratando de modificar una rutina ajena al usuario`
        })
    }

    next()
}

/**
 * Valida que el día que se quiere modificar sea parte de una rutina del usuario que hace la petición
 */
const dayOwnerUser = async(req, res, next) => {
    const {_id: uid, role} = req.user;
    const {idDay} = req.params;

    if (!uid) {
        return res.status(400).json({
            msg: 'Se quiere validar usuario antes de validar token'
        })
    }

    const dayWorkout = await DayWorkout.findById(idDay)

    if (!dayWorkout) {
        return res.status(400).json({
            msg: `No se encontro día de rutina con el id ${idDay}`
        })
    }

    if (dayWorkout.actualUser.toString() != uid.toString() && role !== roles.admin) {
        return res.status(400).json({
            msg: `Se está tratando de modificar un día de rutina ajena al usuario`
        })
    }

    next()
}

/**
 * Valida que el ejercicio en rutina que se quiere modificar sea parte de una rutina del usuario que hace la petición
 */
 const workoutOwnerUser = async(req, res, next) => {
    const {_id: uid, role} = req.user;
    const {idWorkoutInRoutine} = req.params;

    if (!uid) {
        return res.status(400).json({
            msg: 'Se quiere validar usuario antes de validar token'
        })
    }

    const workoutInRoutine = await WorkoutInRoutine.findById(idWorkoutInRoutine)

    if (!workoutInRoutine) {
        return res.status(400).json({
            msg: `No existe workoutInRoutine con el id ${idWorkoutInRoutine}`
        })
    }

    if (workoutInRoutine.actualUser.toString() != uid.toString() && role !== roles.admin) {
        return res.status(400).json({
            msg: `Se está tratando de modificar un workoutInRoutine de rutina ajena al usuario`
        })
    }

    next()
}

/**
 * Valida que la serie del ejercicio que se quiere modificar sea parte de una rutina del usuario que hace la petición
 */
 const setOwnerUser = async(req, res, next) => {
    const {_id: uid, role} = req.user;
    const {idSet} = req.params;

    if (!uid) {
        return res.status(400).json({
            msg: 'Se quiere validar usuario antes de validar token'
        })
    }

    const setWorkout = await SetWorkout.findById(idSet)

    if (!setWorkout) {
        return res.status(400).json({
            msg: `No existe setWorkout con el id ${idSet}`
        })
    }

    if (setWorkout.actualUser.toString() != uid.toString() && role !== roles.admin) {
        return res.status(400).json({
            msg: `Se está tratando de modificar un setWorkout de rutina ajena al usuario`
        })
    }

    next()
}


module.exports = {
    routineOwnerUser,
    dayOwnerUser,
    workoutOwnerUser,
    setOwnerUser
}