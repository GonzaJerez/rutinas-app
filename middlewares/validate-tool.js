const { tools } = require( "../types/tools" );

const validateTool = (req,res,next) => {
    const {days, workouts} = req.body;
    let toolIsValid = true;

    // Si envían la tool desde la creación de rutina entra aca y valida
    if (days){
        days.map( day => {
            if (!day.workouts) return;

            day.workouts.map( (workout) => {
                if(!workout.combinedWorkouts) return;

                workout.combinedWorkouts.map( work => {
                    if (!tools.includes(work.tool)) {
                        return toolIsValid = false;
                    }
                })
            })
        })
    }

    // Si envían la tool desde la creación del ejercicio entra aca y valida
    if (workouts) {
        workouts.map( (workout) => {
            if(!workout.combinedWorkouts) return;

            workout.combinedWorkouts.map( work => {
                if (!tools.includes(work.tool)) {
                    return toolIsValid = false;
                }
            })
        })
    }

    if (!toolIsValid) {
        return res.status(404).json({
            msg: `La tool recibida no es válida. - ${tools}`
        })
    }

    next()
}

module.exports = {validateTool}