const { DayWorkout, Routine } = require( "../models" );


const getDays = async(req, res) => {
    const {idDay} = req.params;

    const dayWorkout = await DayWorkout.findById(idDay)
        .populate({
            path: 'workouts',
            populate: {
                path: 'workout'
            }
        })
        .populate({
            path: 'workouts',
            populate: {
                path: 'sets'
            }
        })

    if (!dayWorkout) {
        return res.status(404).json({
            msg: `No existe día de rutina con el id ${idDay}`
        })
    }

    res.status(200).json({dayWorkout})
}

const postDay = async(req, res) => {
    // const body = req.body;
    const {idRoutine} = req.params;
    const {_id:uid} = req.user;
    
    // Busca rutina donde agregar y también crea el día
    const [routine, dayWorkout] = await Promise.all([
        Routine.findById(idRoutine),
        new DayWorkout({actualUser: uid})
    ])
    
    // Valida q exista rutina con ese id
    if (!routine) {
        return res.status(404).json({
            msg: `No se encontró rutina con el id ${idRoutine}`
        })
    }

    // Valida que no se agreguen más días de los establecidos en la rutina
    if (routine.routine.length === routine.days) {
        return res.status(400).json({
            msg: `Ya están completos los ${routine.days} dias de la rutina`
        })
    }

    // Agrega el nuevo día creado a la rutina especificada
    routine.routine = [...routine.routine, dayWorkout._id]

    // Guarda la rutina actualizada y el nuevo día en DB
    await Promise.all([
        dayWorkout.save(),
        routine.save(),
    ])

    // Devuelve los días completos en la rutina
    await routine.populate('routine')

    res.json({
        dayWorkout
    })
}


/* const putDay = async(req,res) => {
    const {idDay} = req.params;
    const {numMuscles} = req.body;

    const dayWorkout = await DayWorkout.findByIdAndUpdate(idDay, {numMuscles}, {new:true})

    if (!dayWorkout) {
        return res.status(404).json({
            msg: `No se encontró día de rutina con el id ${idDay}`
        })
    }
    
    res.status(200).json({
        dayWorkout
    })
} */

const deleteDay = async(req,res) => {
    const {idDay} = req.params;

    const [dayWorkout, routine] = await Promise.all([
        // Busca y elimina el día de rutina
        DayWorkout.findByIdAndDelete(idDay),
        // Busca la referencia a ese día en la colección de routines en el documento que la tenga
        Routine.findOne({routine:idDay})
    ])

    // Actualiza y guarda las referencias a los días en el documento de Routines
    routine.routine = routine.routine.filter( day => day.toString() !== idDay.toString() )
    await routine.save() 

    res.status(200).json({dayWorkout})
}

module.exports = {
    getDays,
    postDay,
    // putDay,
    deleteDay
}