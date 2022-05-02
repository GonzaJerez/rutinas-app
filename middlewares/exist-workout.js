const { Workout } = require( "../models" );

const existWorkout = async(req, res, next) => {
    const {workout:idWorkout} = req.body;

    const workout = await Workout.findById(idWorkout);

    if (!workout) {
        return res.status(404).json({
            msg: `No existe workout con el id ${idWorkout}`
        })
    }


    next()
}

module.exports = {
    existWorkout
}