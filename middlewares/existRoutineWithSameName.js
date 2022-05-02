const { Routine } = require( "../models" );


const existRoutineWithSameName = async(req, res, next) => {
    const {name} = req.body;
    const {_id: uid} = req.user;

    const exist = await Routine.findOne({actualUser: uid, name})

    if (exist) {
        return res.status(400).json({
            msg: `Usuario ya tiene una rutina llamada ${name}`
        })
    }

    next()
}

module.exports = {
    existRoutineWithSameName
}