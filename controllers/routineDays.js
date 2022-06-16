const { Routine } = require( "../models" );

const postDay = async(req,res) => {
    const {idRoutine} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = [...routine.days, body]
    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser', ['name', 'email']),
        routine.populate('creatorUser', ['name', 'email']),
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

const updateDay = async(req,res) => {
    const {idRoutine, idDay} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.map( day => day._id.toString() !== idDay
        ? day
        : body
    )
    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser', ['name', 'email']),
        routine.populate('creatorUser', ['name', 'email']),
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

const deleteDay = async(req,res) => {
    const {idRoutine, idDay} = req.params;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.filter( day => day._id.toString() !== idDay && day)
    routine.modifyDate = Date.now();

    await Promise.all([
        routine.populate('actualUser', ['name', 'email']),
        routine.populate('creatorUser', ['name', 'email']),
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
    postDay,
    updateDay,
    deleteDay,
}