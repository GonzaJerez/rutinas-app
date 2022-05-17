const {Routine} = require( "../models" )

// Devuelve las rutinas no eliminadas del usuario q hace la peticion
const getRoutines = async(req, res) => {
    const {page = 1, limit=10} = req.query;
    const {_id: uid} = req.user;
    const queryByCreatorUser = {creatorUser: uid}

    // Valida que las querys recibidas sean números
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, deben ser numeros`
        })
    }

    try {
        const [total, routines] = await Promise.all([
            await Routine.countDocuments(queryByCreatorUser),
            await Routine.find(queryByCreatorUser)
                .limit(Number(limit))
                .skip(Number(limit)*Number(page - 1))
                // .populate('actualUser', ['name', 'email'])
                // .populate('creatorUser', ['name', 'email'])
                // .populate('routine')
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
            // Muestra ref de los días
            path: 'routine',
            populate: {
                // Muestra ref de los ejercicios
                path: 'workouts',
                populate: {
                    // Muestra ref del ejercicio elegido
                    path: 'workout'
                }
            }
        })
        .populate({
            path: 'routine',
            populate: {
                path: 'workouts',
                populate: {
                    // Muestra ref de las series
                    path: 'sets'
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

    const creationDate = new Date().getTime()

    const newRoutine = await new Routine({...body, ...assingUser, creationDate})
    await newRoutine.save();

    res.json({
        newRoutine
    })
}


const putRoutine = async(req, res) => {
    const {idRoutine} = req.params;
    const {_id, creatorUser, actualUser, creationDate, ...rest} = req.body;

    const routine = await Routine.findByIdAndUpdate(idRoutine,{...rest}, {new: true})

    res.json({
        routine
    })
}


const deleteRoutine = async(req, res) => {
    const {idRoutine} = req.params;

    // Elimina rutina
    const routine = await Routine.findByIdAndDelete(idRoutine)

    // routine.routine.map()

    res.json({
        routine
    })
}



module.exports = {
    getRoutines,
    getRoutine,
    postRoutine,
    putRoutine,
    deleteRoutine,
}