const { Workout } = require( '../models' );
const { isValidObjectId } = require('mongoose')

const validateWorkout = (req,res,next) => {
    const {days, workouts} = req.body;
    let workoutIsValid = true;

    // Si envían el workout desde la creación de rutina entra aca y valida
    if (days){
        days.map( day => {
            if (!day.workouts) return;

            day.workouts.map( async(workout) => {
                if (!isValidObjectId(workout.workout)) {
                    return workoutIsValid = false;
                }
                const existWorkout = await Workout.findById(workout.workout)
                if (!existWorkout) {
                    return workoutIsValid = false;
                }
            })
        })
    }

    // Si envían el workout desde la creación de ejercicio entra aca y valida
    if (workouts) {
        workouts.map( async(workout) => {
            const existWorkout = await Workout.findById(workout);

            if (!existWorkout) {
                return workoutIsValid = false;
            }
        })
    }

    if (!workoutIsValid) {
        return res.status(404).json({
            msg: `No se encontró workout existente con el id recibido`
        })
    }

    next()
}

module.exports = {validateWorkout}