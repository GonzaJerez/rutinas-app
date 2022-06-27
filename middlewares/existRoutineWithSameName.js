const { Routine } = require( "../models" );

/**
 * Valida que al editar no exista ya una rutina con el nuevo nombre
 */
const existRoutineWithSameName = async(req, res, next) => {
    const {name} = req.body;
    const {_id: uid} = req.user;

    const exist = await Routine.findOne({actualUser: uid, name})

    if (exist) {
        return res.status(400).json({
            msg: `Usted ya tiene una rutina llamada ${name}`
        })
    }

    next()
}

module.exports = {
    existRoutineWithSameName
}