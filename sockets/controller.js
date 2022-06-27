
const { validateJWT, cleaningToCopyRoutine } = require( "../helpers" )
const { cleaningIdsRoutine } = require( "../helpers/cleaningToCopyRoutine" )
const { Routine, Movement, User, Group } = require( "../models" )



const socketController = async(socket) => {
    const token = socket.handshake.headers['x-token']
    const user = await validateJWT(token)

    // Conectar usuario a una sala especial
    socket.join(user._id.toString())

    /**
     *Escuchar evento 'sendRoutine', esta función ya crea la rutina en el usuario que la recibe
    */ 
    socket.on('sendRoutine', async({idRoutine, uidReceiver,type},callback) => {

        // Busca la rutina enviada por el cliente
        const actualRoutine = await Routine.findById(idRoutine)
        
        // Valida que exista la rutina
        if (!actualRoutine) {
            return socket.to(user._id).emit('existRoutine', {
                msg: `No existe rutina con el id ${idRoutine}`
            })
        }
    
        // Valida que la rutina pertenezca al usuario que la quiere enviar
        if (actualRoutine.actualUser.toString() != user._id.toString()) {
            return socket.to(user._id).emit('noOwnerRoutine', {
                msg: `Se está tratando de enviar una rutina ajena al usuario`
            })
        }

        // Limpia la rutina encontrada para poder crear una nueva a partir de esta
        const routineToCopy = cleaningIdsRoutine(actualRoutine)

        // Actualiza y guarda en DB los campos de esa rutina
        const sendBy            = user._id;
        const isPendingToAccept = (type === 'Users') ? true : false;
        const modifyDate        = Date.now();
        const creationDate      = actualRoutine.creationDate

        // Crea copia de rutina por cada usuario que recibe la rutina
        const listRoutinesToInsert = await uidReceiver.map( (userId) => (
            new Routine({
                ...routineToCopy, 
                sendBy, 
                actualUser: (type === 'Users') ? userId : null, 
                isPendingToAccept,
                modifyDate,
                creationDate,
                group: (type === 'Groups') ? userId : null
            })
        ))

        // Busca todos los users o groups enviados por el cliente
        let listUsersReceiver;
        if (type === 'Users') {
            listUsersReceiver = await User.find({_id: {$in:uidReceiver}})
        }
        if (type === 'Groups') {
            listUsersReceiver = await Group.find({_id: {$in:uidReceiver}})
        }

        // Valida que no esté vacía la lista de usuarios que reciben la rutina
        if(listUsersReceiver.lenght === 0){
            return socket.to(user._id).emit('existUserReceiver', {
                msg: `Ocurrió un error al buscar los usuarios`
            })
        }


        // Crea la lista a insertar en el "to" con cada usuario que recibe la rutina
        const movementTo = listUsersReceiver.map( (userReceiver) => (
            {
                name: userReceiver.name,
                email: (type === 'Users') ? userReceiver.email : null,
                _id: userReceiver._id,
                img: userReceiver.img,
                status: (type === 'Users') ? 'Pending' : 'Accepted',
            }
        ))

        const [routine, movement] = await Promise.all([
            // Inserta en coleccion rutinas las copias creadas por cada usuario
            Routine.insertMany(listRoutinesToInsert),
            // Crea documento en colección Movements y guarda en DB
            new Movement({
                // routine: idRoutine,
                routines: listRoutinesToInsert,
                from: {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    img: user.img,
                    status:  'Pending',
                },
                to: movementTo,
                date: Date.now(),
                routineAtSentMoment: {
                    name: routineToCopy.name,
                    typeUnit: routineToCopy.typeUnit,
                    timer: routineToCopy.timer,
                    days: routineToCopy.days
                }
            })
        ])
        
        // Descomprime cada subdocumento hasta las músculos
        await Promise.all([
            movement.populate('routines'),
            movement.populate({
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
            })
        ])

        // Guarda el movimento creado en DB 
        await movement.save();

        // Cuando termina de guardar en DB le envia al cliente que hizo la petición el movimiento y nombre de la rutina enviada
        callback({movement, nameRoutine:actualRoutine.name})

        // Si se envía rutina a otro usuario y no un grupo emite evento 'receiveRoutine' con los datos del usuario que envía la rutina y la rutina
        if (type === 'Users') {
            socket.to(uidReceiver[0]).emit('receiveRoutine', {
                from: {
                    uid:    user._id,
                    name:   user.name,
                    email:  user.email
                },
                routine,
                idMovement: movement._id
            })
        }
    })

    socket.on('routineSendingResponse', async(payload)=>{
        // Busca la rutina y el movimiento enviados por el cliente
        const routine = await Routine.findById(payload.idRoutine)
        const movement = await Movement.findById(payload.idMovement)

        // Si no fue aceptada cambio los status del movimiento
        // y elimino la rutina enviada
        if (!payload.accepted) {
            movement.to = movement.to.map( userTo => userTo._id !== user._id.toString()
                ? userTo
                : {
                    ...userTo,
                    status: 'Rejected'
                }
            )
            await routine.remove()
            // elimina la referencia a la rutina en el movimiento
            movement.routines = movement.routines.filter( el => el.toString() !== payload.idRoutine )
            socket.to(payload.from._id).emit('statusSendRoutine', {
                status: false
            })
        } else {
            // Respuesta al usuario que hizo el envío
            // Actualiza campos de la rutina y movimiento y guarda en DB
            movement.to = movement.to.map( userTo => userTo._id !== user._id.toString()
                ? userTo
                : {
                    ...userTo,
                    status: 'Accepted'
                }
            )
            routine.isPendingToAccept = false;
            routine.modifyDate = Date.now();
            socket.to(payload.from._id).emit('statusSendRoutine', {
                status: true
            })

            await routine.save()
        }
        
        await movement.save()
    })


}

module.exports = {
    socketController
}