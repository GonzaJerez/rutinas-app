const { WorkoutInRoutine, SetWorkout} = require( "../models" );

// Los sets los creo todos juntos asi que los manejo como array
const postSetWorkout = async(req, res) => {
    const {sets} = req.body;
    const {idWorkoutInRoutine} = req.params;
    const {_id:uid} = req.user;

    // Por cada elemento del array voy creando un nuevo documento en la colección setWorkout
    let newSets = [];
    await sets.forEach( async(set) => {
        console.log({...set, actualUser:uid});
        const newSet = await new SetWorkout({...set, actualUser:uid});
        newSets.push(newSet._id);
        await newSet.save()
    })

    // Inserto todos los ids de los sets creados como referencias en el WorkoutInRoutine especificado
    const newDay = await WorkoutInRoutine.findByIdAndUpdate(idWorkoutInRoutine, {$push: {sets: newSets}}, {new:true})
        .populate('sets')

    res.json({
        newDay
    })
}

// Actualiza los sets de a uno, no por array
const putSetWorkout = async(req,res) => {
    const {idSet} = req.params;
    const {numReps, weight} = req.body;

    // Valida que por lo menos algún campo venga con información
    if (!numReps && !weight) {
        return res.status(400).json({
            msg: `No se recibieron datos para actualizar`
        })
    }

    // Valida que los campos recibidos sean números
    if (isNaN(numReps) || isNaN(weight)) {
        return res.status(404).json({
            msg: `Las propiedades numReps y weight deben ser números`
        })
    }

    const setWorkout = await SetWorkout.findByIdAndUpdate(idSet, {numReps, weight}, {new:true});

    res.status(200).json({
        setWorkout
    })
}

const deleteSetWorkout = async(req,res) => {
    const {idSet} = req.params;

    const [setWorkout, workoutInRoutine] = await Promise.all([
        // Busca y elimina la serie en ejercicio
        SetWorkout.findByIdAndDelete(idSet),
        // Busca la referencia a esa serie en la colección de workoutsInRoutine en el documento que la tenga
        WorkoutInRoutine.findOne({sets:idSet})
    ])

    // Actualiza y guarda las referencias a las series en el documento de workoutsInRoutine
    workoutInRoutine.sets = workoutInRoutine.sets.filter( set => set.toString() !== idSet.toString())
    await workoutInRoutine.save();

    res.status(200).json({
        setWorkout
    })
}

module.exports = {
    postSetWorkout,
    putSetWorkout,
    deleteSetWorkout
}