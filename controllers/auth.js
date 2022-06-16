const {request, response} = require('express');
const bcryptjs = require( 'bcryptjs' );

const {User} = require( '../models' );
const { generateJWT } = require( '../helpers/generate-jwt' );
const { googleVerify } = require( '../helpers/google-verify' );
const { transporter } = require( '../helpers/nodemailer-config' );


const login = async(req=request, res=response) => {

    try {
        const {email, password} = req.body;
        const emailLower = email.toLowerCase()
        const user = await User.findOne({email:emailLower})
    
        // Validar q exista correo
        if(!user){
            return res.status(400).json({
                msg: 'El correo no se encuentra registrado'
            })
        }
    
        // Validar estado del usuario
        if(!user.status){
            return res.status(400).json({
                msg: 'Usuario eliminado, hable con el administrador.'
            })
        }
    
        // Validar contraseña
        const isValidPass = bcryptjs.compareSync(password, user.password)
        if( !isValidPass ) {
            return res.status(400).json({
                msg: 'El email o la contraseña son incorrectos'
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
                msg: 'Usuario eliminado, hable con el administrador.'
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

    res.status(200).json({
        user,
        token
    })
}

/**
 * Envío de email para recuperar la contraseña de un usuario
 */
const sendEmail = async(req,res) => {
    const {emailUser} = req.body;
    const emailLower = emailUser.toLowerCase()

    // Genera código de seguridad de 6 digitos
    const securityCode = Math.floor(Math.random()*1000000)

    // Busca el usuario por email
    const user = await User.findOne({email:emailLower})

    // Si el email recibido no existe
    if (!user) {
        return res.status(404).json({
            msg: `El correo no se encuentra registrado`
        })
    }

    // Si el email está registrado con google no se puede recuperar contraseña
    if (user.google) {
        return res.status(400).json({
            msg: `No es posible recuperar la contraseña del usuario ya que se encuentra regitrado con google`
        })
    }

    // Guarda el código de seguridad en DB en el User
    user.temporalSecurityCode = String(securityCode)

    await user.save()

    // Envía el código de seguridad por email
    await transporter.sendMail({
        from: `"Rutinas app" <${process.env.EMAIL_APP}>`, // sender address
        to: emailLower, // list of receivers
        subject: `Recuperar contraseña`, // Subject line
        html: `
            <p>Tu código para recuperar la contraseña es: </p>
            <b>${securityCode}<b/>
        `
    });

    res.status(200).json({
        ok: true
    })
}

/**
 * Valida código de seguridad para recuperar contraseña
 */
const securityCode = async(req,res) => {
    const {emailUser, securityCode} = req.body;
    const emailLower = emailUser.toLowerCase()

    // Busca un usario donde el email y el código de seguridad coincidan con los que se reciben del fron
    const user = await User.findOne({email:emailLower, temporalSecurityCode: securityCode})

    // Si el email recibido no existe
    if (!user) {
        return res.status(400).json({
            msg: `Código inválido`
        })
    }

    // Elimina el código de seguridad del usuario
    user.temporalSecurityCode = null
    await user.save()

    res.status(200).json({
        ok:true
    })
}

/**
 * Actualizar contraseña de usuario después de validar código de seguridad enviado por email
 */
const renewPassword = async(req,res) => {
    const {emailUser, newPassword} = req.body;
    const emailLower = emailUser.toLowerCase()

    // Busca al usuario por email
    const user = await User.findOne({email:emailLower})

    // Validar contraseña nueva
    const isSameLastPass = bcryptjs.compareSync(newPassword, user.password)
    if( isSameLastPass ) {
        return res.status(400).json({
            msg: 'La contraseña no puede ser igual a la anterior'
        })
    }

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(newPassword, salt )

    await user.save()

    res.status(200).json({
        ok:true
    })
    
}

module.exports= {
    login,
    googleSignIn,
    renewToken,
    sendEmail,
    securityCode,
    renewPassword
}