const {request, response} = require('express');
const bcryptjs = require( 'bcryptjs' );

const {User} = require( '../models' );
const { generateJWT } = require( '../helpers/generate-jwt' );
const { googleVerify } = require( '../helpers/google-verify' );
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

const googleSignIn = async(req, res) => {
    const {idToken} = req.body

    try {

        const {name, email, img} = await googleVerify(idToken)
        const data = {
            name,
            email,
            img,
            password: ':P',
            google: true,
        }
        let user = await User.findOne({email})

        // Si el user no existe entonces lo crea
        if (!user) {
            user = new User(data)
            await user.save()
        }

        // Si el user tiene estado en false no lo deja ingresar
        if (!user.status) {
            return res.status(401).json({
                msg: 'Hable con el administrador, user con estado en false'
            })
        }

        // Generar JWT
        const token = await generateJWT(user._id);
        
        res.status(200).json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

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
    googleSignIn,
    renewToken
}