const {Routine} = require( "../models" );

const postWorkoutInRoutine = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkout} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkout
                ? workout
                : {
                    ...workout,
                    combinedWorkouts: [...workout.combinedWorkouts, body]
                }
            )
        }
    )
    routine.modifyDate = Date.now();

    await routine.populate({
        path: 'days',
        populate: {
            path: 'workouts',
            populate: {
                path: 'combinedWorkouts',
                populate: {
                    path: 'workout',
                    populate: {
                        path: 'muscle'
                    }
                }
            }
        }
    })

    await routine.save()

    res.json({
        routine
    })
}


const putWorkoutInRoutine = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkout, idWorkoutInRoutine} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkout
                ? workout
                : {
                    ...workout,
                    combinedWorkouts: workout.combinedWorkouts.map( work => work._id.toString() !== idWorkoutInRoutine 
                    ? work
                    : body
                )}
            )     
        }
    )

    routine.modifyDate = Date.now();

    await routine.populate({
        path: 'days',
        populate: {
            path: 'workouts',
            populate: {
                path: 'combinedWorkouts',
                populate: {
                    path: 'workout',
                    populate: {
                        path: 'muscle'
                    }
                }
            }
        }
    })

    await routine.save()

    res.json({
        routine
    })
}


const deleteWorkoutInRoutine = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkout, idWorkoutInRoutine} = req.params;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkout
                ? workout
                : {
                    ...workout,
                    combinedWorkouts: workout.combinedWorkouts.filter( work => work._id.toString() !== idWorkoutInRoutine && work)
                }
            )     
        }
    )

    routine.modifyDate = Date.now();

    await routine.populate({
        path: 'days',
        populate: {
            path: 'workouts',
            populate: {
                path: 'combinedWorkouts',
                populate: {
                    path: 'workout',
                    populate: {
                        path: 'muscle'
                    }
                }
            }
        }
    })

    await routine.save()

    res.json({
        routine
    })
}

module.exports = {
    postWorkoutInRoutine,
    putWorkoutInRoutine,
    deleteWorkoutInRoutine
}