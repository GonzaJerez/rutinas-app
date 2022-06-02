
const { validateJWT, cleaningToCopyRoutine } = require( "../helpers" )
const { Routine, Movement } = require( "../models" )
const movement = require( "../models/movement" )



const socketController = async(socket) => {
    const token = socket.handshake.headers['x-token']
    const user = await validateJWT(token)

    // Conectar usuario a una sala especial
    socket.join(user._id.toString())

    /**
     *Escuchar evento 'sendRoutine', esta función ya crea la rutina en el usuario que la recibe
    */ 
    socket.on('sendRoutine', async({idRoutine, uidReceiver}) => {

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
        const routineToCopy = await cleaningToCopyRoutine(actualRoutine)

        // Actualiza y guarda en DB los campos de esa rutina
        const sendBy            = routine.actualUser;
        const actualUser        = uidReceiver;
        const isPendingToAccept = true;
        const modifyDate        = new Date().getTime();

        const [routine, movement] = await Promise.all([
            // Crea copia de rutina con nuevo usuario 
            new Routine({
                ...routineToCopy, 
                sendBy, 
                actualUser, 
                isPendingToAccept,
                modifyDate
            }),
            // Crea documento en colección Movements y guarda en DB
            new Movement({
                routine: payload.idRoutine,
                from:    routine.lastUser,
                to:      routine.actualUser,
                date:    new Date().getTime(),
                status:  'Pending'
            })
        ])

        await Promise.all([
            routine.save(),
            movement.save()
        ])

        socket.to(routine.lastUser).emit('sendSuccess', {
            movement
        })

        // Emite evento 'receiveRoutine' con los datos del usuario que envía la rutina y la rutina
        socket.to(uidReceiver).emit('receiveRoutine', {
            from: {
                uid:    user._id,
                name:   user.name,
                email:  user.email
            },
            routine,
            idMovement: movement._id
        })
    })

    socket.on('routineSendingResponse', async(payload)=>{
        // Busca la rutina y el movimiento enviados por el cliente
        const routine = await Routine.findById(payload.idRoutine)
        const movement = await movement.findById(payload.idMovement)

        // Si no fue aceptada cambio los status de la rutina y del movimiento
        // y elimino la rutina enviada
        if (!payload.accepted) {
            // routine.actualUser = routine.lastUser;
            movement.status = 'Rejected';
            await routine.remove()
            socket.to(payload.from.uid).emit('statusSendRoutine', {
                status: false
            })
        } else {
            // Respuesta al usuario que hizo el envío
            // Actualiza campos de la rutina y movimiento y guarda en DB
            movement.status = 'Accepted';
            routine.isPendingToAccept = false;
            routine.modifyDate = new Date().getTime();
            socket.to(payload.from.uid).emit('statusSendRoutine', {
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