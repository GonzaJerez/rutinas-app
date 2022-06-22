const { Routine } = require( "../models" );


const postCombinedWorkouts = async(req,res) => {
    const {idRoutine, idDay} = req.params;
    const body = req.body;

    const bodyWithoutIds = {
        combinedWorkouts: body.combinedWorkouts.map( workout => ({
            tool: workout.tool,
            workout: workout.workout,
            sets: workout.sets.map( set => ({
                weight: set.weight, 
                numReps: set.numReps,
                isDescending: set.isDescending
            })),
            mode: workout.mode
        }))
    }

    const routine = await Routine.findById(idRoutine);

    if (!routine) {
        return res.status(400).json({
            msg: `No existe rutina con el id ${idRoutine}`
        })
    }

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: [
                ...day.workouts,
                bodyWithoutIds
            ]
        }
    )

    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser'),
        routine.populate('creatorUser'),
        routine.populate({
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
    ])

    await routine.save()

    res.json({
        routine
    })
}

const updateCombinedWorkouts = async(req,res) => {
    const {idRoutine, idDay, idCombinedWorkouts} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    // Si recibo "combinedWorkouts" vacío significa que acaban de borrar todos los ejercicios de este
    // Entonces elimino el combinedWorkout para que no quede vacío
    if (body.combinedWorkouts.length === 0) {
        routine.days = routine.days.map( day => day._id.toString() !== idDay 
            ? day
            : {
                ...day,
                workouts: day.workouts.filter( workout => workout._id.toString() !== idCombinedWorkouts && workout)
            }
        )
    } else {
        // Si no viene vacío actualizo el combinedWorkouts
        const bodyWithoutIds = {
            combinedWorkouts: body.combinedWorkouts.map( workout => ({
                tool: workout.tool,
                workout: workout.workout,
                sets: workout.sets.map( set => ({
                    weight: set.weight, 
                    numReps: set.numReps,
                    isDescending: set.isDescending
                })),
            }))
        }
    
        routine.days = routine.days.map( day => day._id.toString() !== idDay 
            ? day
            : {
                ...day,
                workouts: day.workouts.map( workout => workout._id.toString() !== idCombinedWorkouts 
                    ? workout
                    : bodyWithoutIds
                )
            }
        )
    }


    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser'),
        routine.populate('creatorUser'),
        routine.populate({
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
    ])

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

    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser'),
        routine.populate('creatorUser'),
        routine.populate({
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
    ])

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
    console.log(routine.days[0].workouts);

    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser'),
        routine.populate('creatorUser'),
        routine.populate({
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
    ])

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