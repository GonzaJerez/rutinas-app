const {Routine} = require( "../models" );

const postWorkoutInRoutine = async(req,res) => {
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

    await routine.populate({
        path: 'days',
        populate: {
            path: 'workouts',
            populate: {
                path: 'workout'
            }
        }
    })

    await routine.save()

    res.json({
        routine
    })
}

const putWorkoutInRoutine = async(req,res) => {
    const {idRoutine, idDay, idWorkoutInRoutine} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day, 
            workouts: day.workouts.map( workout => workout._id.toString() !== idWorkoutInRoutine
                ? workout
                : body)
        }
    )

    await routine.populate({
        path: 'days',
        populate: {
            path: 'workouts',
            populate: {
                path: 'workout'
            }
        }
    })

    await routine.save()

    res.json({
        routine
    })
}

const deleteWorkoutInRoutine = async(req,res) => {
    const {idRoutine, idDay, idWorkoutInRoutine} = req.params;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay 
        ? day 
        : {
            ...day,
            workouts: day.workouts.filter( workout => workout._id.toString() !== idWorkoutInRoutine && workout )
        }
    )

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