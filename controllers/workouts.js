const {Workout} = require( "../models" );


const getWorkouts = async(req, res) => {
    let {muscle, page= 1, limit=10} = req.query;
    let query = {status:true};

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, page y limit deben ser numeros`
        })
    }

    if (muscle) {
        muscle = muscle.toUpperCase();
        query={...query, muscle}
    }

    const [total, workouts] = await Promise.all([
        await Workout.countDocuments(query),
        await Workout.find(query)
            .limit(Number(limit))
            .skip(Number(limit)*Number(page - 1))
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

    const workout = await Workout.findById(id)

    if (!workout) {
        return res.status(400).json({
            msg: `No existe ejercicio con el id ${id}`
        })
    }

    res.json({ workout })
}


const postWorkout = async(req, res) => {
    let {name, muscle} = req.body;

    name = name.toUpperCase();
    muscle = muscle.toUpperCase();

    const workout = await new Workout({name, muscle})
    workout.save();

    res.json({workout})
}


const putWorkout = async(req, res) => {
    const {id} = req.params;
    let {name,muscle} = req.body;

    if (!name && !muscle) {
        return res.status(400).json({
            msg: 'El nombre o el musculo son requeridos para actualizar ejercicio'
        })
    }

    name = (name) && name.toUpperCase()
    muscle = (muscle) && muscle.toUpperCase()

    const newWorkout = await Workout.findByIdAndUpdate(id, {name,muscle}, {new:true})

    res.json({newWorkout})
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