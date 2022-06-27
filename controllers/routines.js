
const { cleaningToCopyRoutine, cleaningIdsRoutine } = require( "../helpers" );
const {Routine} = require( "../models" )

// Devuelve las rutinas no eliminadas del usuario q hace la peticion
const getRoutines = async(req, res) => {
    const {page = 1, limit=10, addedRoutines=0} = req.query;
    const {_id: uid} = req.user;

    // Query para devolver solo las rutinas del usuario que hayan sido aceptadas
    const queryByActualUser = {actualUser: uid, isPendingToAccept:false}

    // Valida que las querys recibidas sean números
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, deben ser numeros`
        })
    }

    try {
        const [total, routines] = await Promise.all([
            await Routine.countDocuments(queryByActualUser),
            await Routine.find(queryByActualUser)
                .sort({modifyDate: 'desc'})
                .limit(Number(limit))
                .skip(Number(limit)*Number(page - 1) + Number(addedRoutines))
                .populate('actualUser', ['name', 'email'])
                .populate('creatorUser', ['name', 'email'])
                .populate({
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

        res.status(200).json({
            page,
            limit,
            total,
            routines
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

const getRoutine = async(req, res) => {
    const {idRoutine} = req.params;

    const routine = await Routine.findById(idRoutine)
        .populate('actualUser', ['name', 'email'])
        .populate('creatorUser', ['name', 'email'])
        .populate({
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

    if (!routine) {
        return res.status(404).json({
            msg: `No existe rutina con el id ${idRoutine}`
        })
    }

    res.json({
        routine
    })
}


const postRoutine = async(req, res) => {
    const body = req.body;
    const {_id: uid} = req.user;

    const assingUser = {
        creatorUser: uid,
        actualUser: uid
    }

    const routineWithoutIds = cleaningIdsRoutine(body)

    const dateNow = Date.now()

    const creationDate = dateNow;
    const modifyDate = dateNow;

    const routine = await new Routine({...routineWithoutIds, ...assingUser, creationDate, modifyDate})

    // Si es rutina predeterminada deja los días exactamente igual, si es una rutina personalizada nueva
    // crea el primer día dentro de la rutina
    routine.days = (!routine.days.length === 0) ? routine.days : [{}]

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

    await routine.save();

    res.json({
        routine
    })
}


const putRoutine = async(req, res) => {
    const {idRoutine} = req.params;
    const {_id, creatorUser, actualUser, creationDate, ...rest} = req.body;
    const modifyDate = Date.now();

    const routine = await Routine.findByIdAndUpdate(idRoutine,{...rest, modifyDate}, {new: true})
        .populate('actualUser', ['name', 'email'])
        .populate('creatorUser', ['name', 'email'])
        .populate({
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

    res.json({
        routine
    })
}


const deleteRoutine = async(req, res) => {
    const {idRoutine} = req.params;

    // Elimina rutina
    const routine = await Routine.findByIdAndDelete(idRoutine)

    res.json({
        routine
    })
}

const copyRoutine = async(req,res) => {
    const {idRoutine} = req.params;

    // Busca la rutina por id
    const actualRoutine = await Routine.findById(idRoutine)
    
    // Limpia la rutina encontrada para poder crear una nueva a partir de esta
    const routineToCopy = await cleaningToCopyRoutine(actualRoutine)

    // Actualiza fechas de creación y modificación
    const dateNow = Date.now()
    const creationDate = dateNow;
    const modifyDate = dateNow;

    // Crea la nueva rutina
    const routine = await new Routine({...routineToCopy, creationDate, modifyDate})

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

    res.json({routine})
}



module.exports = {
    getRoutines,
    getRoutine,
    postRoutine,
    putRoutine,
    deleteRoutine,
    copyRoutine,
}