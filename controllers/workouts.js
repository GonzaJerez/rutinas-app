const { isValidObjectId } = require('mongoose');
const path = require('path')
const fs = require('fs')

const {Workout, Muscle} = require( "../models" );
const { uploadImg } = require( "../helpers" );
const { tools } = require( '../types/tools' );


const getWorkouts = async(req, res) => {
    let {muscleId, page= 1, limit=10} = req.query;
    let query = {status:true};

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, page y limit deben ser numeros`
        })
    }

    if (muscleId) {
        const isMongoID = isValidObjectId(muscleId)
        if (!isMongoID) {
            return res.status(404).json({
                msg:`El id del músculo no es un id válido de Mongo`
            })
        } else {
            query={...query, muscle:muscleId}
        }
    }

    const [total, workouts] = await Promise.all([
        await Workout.countDocuments(query),
        await Workout.find(query)
            .limit(Number(limit))
            .skip(Number(limit)*Number(page - 1))
            .populate('muscle')
    ])

    res.json({
        page,
        limit,
        total,
        workouts
    })
}


const getWorkout = async(req, res) => {
    const {id} = req.params;

    const workout = await Workout.findById(id).populate('muscle')

    if (!workout) {
        return res.status(400).json({
            msg: `No existe ejercicio con el id ${id}`
        })
    }

    res.json({ workout })
}


const postWorkout = async(req, res) => {
    let {name, muscle} = req.body;
    let img;

    name = name.toUpperCase();

    const workout = await new Workout({name, muscle})

    // Valida si se envía img
    if (req.files?.img) {
        // Crea img en servidor
        img = await uploadImg(req.files, 'workouts')
        workout.img = img
    }

    // Si se recibe validTools valida que cada una exista en array de todas las tools disponibles
    if (validTools) {
        const isToolsIncorrect = validTools.find( tool => !tools.includes(tool))
        if (isToolsIncorrect){
            return res.status(404).json({
                msg: `Ocurrió un problema con las validTools recibidas`
            })
        }
        workout.validTools = validTools
    }

    await workout.save();

    res.json({workout})
}


const putWorkout = async(req, res) => {
    const {id} = req.params;
    let {name,muscle, validTools} = req.body;
    let newImg;

    const workout = await Workout.findById(id)

    if (!workout) {
        return res.status(404).json({
            msg: `No existe ejercicio con el id ${id}`
        })
    }

    // Valida si se quiere actualizar la img
    if (req.files?.img) {
        newImg = await uploadImg(req.files, 'workouts')
        // Si ya existe una img para ese músculo en servidor la elimino
        if (workout.img) {
            const pathImg = path.join(__dirname, '../assets/workouts', workout.img);
            // Verificar q exista img en servidor
            if (fs.existsSync(pathImg)) {
                // Eliminar img del servidor
                fs.unlinkSync(pathImg)
            }
        }
        workout.img = newImg;
    }

    // Si se recibe nuevo nombre lo actualiza
    if (name) {
        workout.name = name.toUpperCase();
    }

    // Si se recibe nuevo músculo valida que exista en DB y lo actualiza
    if (muscle) {
        const existMuscle = await Muscle.findById(muscle)
        if (!existMuscle) {
            return res.status(404).json({
                msg: `No se encontró músculo con el id ${muscle}`
            })
        }
        workout.muscle = muscle;
    }

    // Si se recibe validTools valida que cada una exista en array de todas las tools disponibles
    if (validTools) {
        const isToolsIncorrect = validTools.find( tool => !tools.includes(tool))
        if (isToolsIncorrect){
            return res.status(404).json({
                msg: `Ocurrió un problema con las validTools recibidas`
            })
        }
        workout.validTools = validTools
    }

    // Si no recibe argumento para actualizar devuelve error
    if (!name && !muscle && !newImg && !validTools) {
        return res.status(400).json({
            msg: 'El nombre, músculo, img o tools válidas son requeridos para actualizar ejercicio'
        })
    }

    // Guarda workout modificado en DB
    await workout.save();

    res.json({workout})
}


const deleteWorkout = async(req, res) => {
    const {id} = req.params;

    const workout = await Workout.findByIdAndUpdate(id, {status:false}, {new:true})

    if (!workout) {
        return res.status(400).json({
            msg: `No existe ejercicio con el id ${id}`
        })
    }

    res.json({workout})
}


module.exports = {
    getWorkouts,
    getWorkout,
    postWorkout,
    putWorkout,
    deleteWorkout
}