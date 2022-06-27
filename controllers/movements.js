const { Movement } = require( "../models" )

// Obtener movimientos del usuario que hace la petición
const getMovements = async(req,res) =>{

    const {page = 1, limit=10} = req.query;
    const {_id:uid} = req.user;

    const query = {
        $or:[{'from.uid': uid.toString()}, {'to.uid': uid.toString()}]
    }

    // Valida que las querys recibidas sean números
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, "page" y "limit" deben ser numeros`
        })
    }

    // Busca los movimientos
    const [movements, total] = await Promise.all([
        Movement.find(query)
            .sort({date: 'desc'})
            .limit(Number(limit))
            .skip(Number(limit)*Number(page - 1))
            // .populate('to', ['name', 'email'])
            // .populate('from', ['name', 'email'])
            .populate({
                path: 'routines',
                populate: {
                    path: 'actualUser'
                }
            })
            .populate({
                path: 'routineAtSentMoment',
                populate: {
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
                }
            }),
        Movement.countDocuments(query)
    ])


    res.status(200).json({
        total,
        page,
        limit,
        movements
    })
}


const getMovement = async(req,res) => {
    const {id} = req.params;
    const {_id:uid} = req.user;

    const query = {
        $or:[{from: uid}, {to: uid}],
        $and: [{_id: id}]
    }

    const movement = await Movement.findOne(query)

    if (!movement) {
        return res.status(404).json({
            msg: `No existe movimiento con el id ${id} o no tiene los derechos para verlo`
        })
    }

    res.status(200).json({
        movement
    })
}

module.exports = {
    getMovements,
    getMovement
}