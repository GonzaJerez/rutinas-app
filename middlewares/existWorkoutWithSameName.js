const { Workout } = require( "../models" );


const existWorkoutWithSameName = async(req, res, next) => {
    let {name} = req.body;

    if (name) {
        name = name.toUpperCase();
    
        const exist = await Workout.findOne({name})
    
        if (exist) {
            return res.status(400).json({
                msg: `Ya existe un ejercicio llamado ${name}`
            })
        }
    }

    next()
}

module.exports = {
    existWorkoutWithSameName
}