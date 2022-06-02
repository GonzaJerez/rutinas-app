const { Routine } = require( "../models" );


const postCombinedWorkouts = async(req,res) => {
    const {idRoutine, idDay} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: [
                ...day.workouts,
                body
            ]
        }
    )

    routine.modifyDate = new Date().getTime();

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

const updateCombinedWorkouts = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkouts} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day
        : {
            ...day,
            workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkouts 
                ? workout
                : body
            )
        }
    )

    routine.modifyDate = new Date().getTime();

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

const patchWeightCombinedWorkouts = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkouts} = req.params;
    const {newWeights} = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day
        : {
            ...day,
            workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkouts 
                ? workout
                : {
                    ...workout,
                    combinedWorkouts: workout.combinedWorkouts.map( work => ({
                        ...work, 
                        sets: work.sets.map( (set, index) => ({...set, weight: newWeights[index]}) )
                    }))
                }
            )
        }
    )

    routine.modifyDate = new Date().getTime();

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

const deleteCombinedWorkout = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkouts} = req.params;
    console.log({idCombinedWorkouts});
    console.log({idDay});

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day
        : {
            ...day,
            workouts: day.workouts.filter( workout => workout._id.toString() !== idCombinedWorkouts && workout)
        }
    )

    routine.modifyDate = new Date().getTime();

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
    postCombinedWorkouts,
    updateCombinedWorkouts,
    patchWeightCombinedWorkouts,
    deleteCombinedWorkout
}