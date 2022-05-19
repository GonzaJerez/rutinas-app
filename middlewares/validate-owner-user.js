const { Routine } = require( "../models" );
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


module.exports = {
    routineOwnerUser,
}