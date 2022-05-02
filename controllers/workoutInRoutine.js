const { WorkoutInRoutine, DayWorkout } = require( "../models" );

const postWorkoutInRoutine = async(req, res) => {
    const body = req.body;
    const {idDay} = req.params;
    const {_id:uid} = req.user;

    // Busca dia donde agregar y también crea el ejercicio
    const [dayWorkout, workoutInRoutine] = await Promise.all([
        DayWorkout.findById(idDay),
        new WorkoutInRoutine({...body, actualUser: uid})
    ])

    // Valida q exista día con ese id
    if (!dayWorkout) {
        return res.status(404).json({
            msg: `No se encontró día de rutina con el id ${idDay}`
        })
    }

    // Agrega la ref del nuevo ejercicio creado al día de rutina especificado
    dayWorkout.workouts = [...dayWorkout.workouts, workoutInRoutine._id]

    // Guarda el día actualizado y el nuevo ejercicio en DB
    await Promise.all([
        workoutInRoutine.save(),
        dayWorkout.save(),
    ])

    // Devuelve los días completos en la rutina
    await dayWorkout.populate('workouts')

    res.json({
        dayWorkout
    })
}

const putWorkoutInRoutine = async(req,res) => {
    const {tool} = req.body;
    const {idWorkoutInRoutine} = req.params;

    const workoutInRoutine = await WorkoutInRoutine.findByIdAndUpdate(idWorkoutInRoutine, {tool}, {new:true})

    res.status(200).json({
        workoutInRoutine
    })
}

const deleteWorkoutInRoutine = async(req,res) => {
    const {idWorkoutInRoutine} = req.params;

    const [workoutInRoutine, routineDay] = await Promise.all([
        // Busca y elimina workoutInRoutine
        await WorkoutInRoutine.findByIdAndDelete(idWorkoutInRoutine),
        // Busca la referencia a ese workout en la colección de routineDays en el documento que la tenga
        DayWorkout.findOne({workouts:idWorkoutInRoutine})
    ])

    // Elimina y guarda las referencias a los ejercicios en el documento de routineDays
    routineDay.workouts = routineDay.workouts.filter( workout => workout.toString() !== idWorkoutInRoutine.toString())
    await routineDay.save()

    res.status(200).json({
        workoutInRoutine
    })
}

module.exports = {
    postWorkoutInRoutine,
    putWorkoutInRoutine,
    deleteWorkoutInRoutine
}