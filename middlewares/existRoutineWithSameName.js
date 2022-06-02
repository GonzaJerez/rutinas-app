const { Routine } = require( "../models" );


const existRoutineWithSameName = async(req, res, next) => {
    const {name, _id} = req.body;
    const {_id: uid} = req.user;

    const exist = await Routine.findOne({actualUser: uid, name})

    if (exist._id.toString() !== _id.toString()) {
        return res.status(400).json({
            msg: `Usuario ya tiene una rutina llamada ${name}`
        })
    }

    next()
}

module.exports = {
    existRoutineWithSameName
}