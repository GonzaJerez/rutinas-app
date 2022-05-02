// Referencias HTML
const idRoutine     = document.querySelector('#idRoutine')
const uidReceiver = document.querySelector('#uidReceiver')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir   = document.querySelector('#btnSalir')


const url = (window.location.hostname.includes('localhost'))
        ? 'http://localhost:8080/api/auth/'
        : 'https://curso-node-restserver-gj.herokuapp.com/api/auth/'

// const socket = io()

let user = null;
let socket  = null; 


const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch( url, {
        headers: {
            'x-token': token
        }
    } )

    const {user: userDB, token: tokenDB} = await resp.json();

    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await conectarSocket();

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders' : {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('receiveRoutine', (payload) => {
        const statusRespuesta = window.confirm(`${payload.from.name} te ha enviado una rutina`)

        if (statusRespuesta) {
            socket.emit('routineSendingResponse', {
                idRoutine: payload.idRoutine,
                accepted: true,
                from: payload.from
            })
        } else {
            console.log('entra aca');
            socket.emit('routineSendingResponse', {
                idRoutine: payload.idRoutine,
                accepted: false,
                from: payload.from
            })
        }
    })

    socket.on('statusSendRoutine', payload => {
        console.log(payload);
    })

    /* socket.on('connect', ()=>{
        console.log('Socket conectado');
    })

    socket.on('recibir-mensajes', dibujarMensajes)

    socket.on('usuarios-activos', dibujarUsuarios )

    socket.on('mensaje-privado', (payload)=>{
        console.log(payload);
    }) */
}
/* 
const dibujarUsuarios = (usuarios=[]) => {
    let usersHTML = '';
    
    usuarios.forEach( ({nombre, uid}) => {
        usersHTML += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <small class="fs-6 text-muted">${uid}</small>
            </p>
        </li>
    `
    })

    ulUsuarios.innerHTML = usersHTML;
}

const dibujarMensajes = (mensajes=[]) => {
    let msgHTML = '';
    
    mensajes.forEach( ({mensaje, nombre, uid}) => {
        msgHTML += `
        <li>
            <p>
                <span class="text-${uid === usuario.uid ? 'primary' : 'secondary'}">${nombre}</span>
                <small class="fs-6">${mensaje}</small>
            </p>
        </li>
    `
    })
    
    ulMensajes.innerHTML = msgHTML;
}
 */

uidReceiver.addEventListener('keypress', ({keyCode}) => {
    if (keyCode === 13){
        // if (mensaje.trim().length === 0) return;
        socket.emit('sendRoutine', {idRoutine: idRoutine.value, uidReceiver: uidReceiver.value})
    }
})



const main = async() => {
    validarJWT();
}

main();