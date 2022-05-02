const {request, response} = require('express');
const bcryptjs = require( 'bcryptjs' );

const {User} = require( '../models' );
const { generateJWT } = require( '../helpers/generate-jwt' );
// const { googleVerify } = require( '../helpers/google-verify' );


const login = async(req=request, res=response) => {

    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
    
        // Validar q exista correo
        if(!user){
            return res.status(400).json({
                msg: 'Error en el login - email no existe'
            })
        }
    
        // Validar estado del usuario
        if(!user.status){
            return res.status(400).json({
                msg: 'Error en el login - estado: false'
            })
        }
    
        // Validar contraseña
        const isValidPass = bcryptjs.compareSync(password, user.password)
        if( !isValidPass ) {
            return res.status(400).json({
                msg: 'Error en el login - password incorrecta'
            })
        }
    
        // Generar JWT
        const token = await generateJWT(user._id);
        
        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

// const googleSignIn = async(req, res) => {
//     const {id_token} = req.body

//     try {

//         const {nombre, img, correo} = await googleVerify(id_token)
//         const data = {
//             nombre,
//             img,
//             correo,
//             password: ':P',
//             google: true,
//             rol: 'USER_ROLE'
//         }
//         let usuario = await User.findOne({correo})

//         // Si el usuario no existe entonces lo crea
//         if (!usuario) {
//             usuario = new User(data)
//             await usuario.save()
//         }

//         // Si el usuario tiene estado en false no lo deja ingresar
//         if (!usuario.estado) {
//             return res.status(401).json({
//                 msg: 'Hable con el administrador, usuario con estado en false'
//             })
//         }

//         // Generar JWT
//         const token = await generateJWT(usuario._id);
        
//         res.status(200).json({
//             usuario,
//             token
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             ok: false,
//             msg: 'El token no se pudo verificar'
//         })
//     }

// }

const renewToken = async(req, res) => {
    const {user} = req;

    // Generar JWT
    const token = await generateJWT(user._id);

    res.json({
        user,
        token
    })
}

module.exports= {
    login,
    // googleSignIn,
    renewToken
}