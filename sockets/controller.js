
const { validateJWT } = require( "../helpers" )
const { Routine } = require( "../models" )



const socketController = async(socket) => {
    const token = socket.handshake.headers['x-token']
    const user = await validateJWT(token)

    // Conectar usuario a una sala especial
    socket.join(user._id.toString())

    // Escuchar evento 'sendRoutine'
    socket.on('sendRoutine', async({idRoutine, uidReceiver}) => {
        
        // Busca la rutina enviada por el cliente
        const routine = await Routine.findById(idRoutine)

        // Valida que exista la rutina
        if (!routine) {
            return res.status(400).json({
                msg: `No se encontro ninguna rutina con el id ${idRoutine}`
            })
        }
    
        // Valida que la rutina pertenezca al usuario que la quiere enviar
        if (routine.actualUser.toString() != uidReceiver.toString()) {
            return res.status(400).json({
                msg: `Se está tratando de enviar una rutina ajena al usuario`
            })
        }

        // Actualiza y guarda en DB los campos de esa rutina
        routine.lastUser    = routine.actualUser;
        routine.actualUser  = uidReceiver;
        routine.isPendingToAccept = true;

        await routine.save();

        // Emite evento 'receiveRoutine' con los datos del usuario que envía la rutina y el id de esta
        socket.to(uidReceiver).emit('receiveRoutine', {
            from: {
                uid: user._id,
                name: user.name,
                email: user.email
            },
            idRoutine
        })
    })

    socket.on('routineSendingResponse', async(payload)=>{
        // Busca la rutina enviada por el cliente
        const routine = await Routine.findById(payload.idRoutine)

        // Si no fue aceptada el actualUser vuelve a ser el mismo que era antes del envío
        if (!payload.accepted) {
            routine.actualUser = routine.lastUser;
            socket.to(payload.from.uid).emit('statusSendRoutine', {
                status: false
            })
        } else {
            socket.to(payload.from.uid).emit('statusSendRoutine', {
                status: true
            })
        }
        
        // Actualiza campos de la rutina y guarda en DB
        await routine.save()
        await Routine.findByIdAndUpdate({_id: payload.idRoutine},{isPendingToAccept: false, $unset:{lastUser: ''}} )
    })


}

module.exports = {
    socketController
}