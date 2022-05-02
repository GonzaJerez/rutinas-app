const miFormulario = document.querySelector('form');

const url = 'http://localhost:8080/api/auth/'

/* // Login con google
function handleCredentialResponse(response) {

    const body = {id_token: response.credential};

    fetch( url + 'google',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(data => {
        // console.log(data)
        localStorage.setItem('email', data.usuario.correo)
        localStorage.setItem('token', data.token)
        window.location = 'chat.html'
    })
    .catch(err => console.warn(err))

} */

// Login manual
miFormulario.addEventListener('submit', e => {
    e.preventDefault();

    const formData = {};
    
    for(let el of miFormulario.elements){
        if (el.name.length !== 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login',{
        method: 'POST',
        body:   JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(({token}) => {
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(err => console.log(err))
})

/* // Logout
const button = document.getElementById('button-logout')
button.addEventListener('click', ()=>{
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload()
    })
}) */