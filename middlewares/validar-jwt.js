const { request, response } = require( 'express' )
const jwt = require('jsonwebtoken');
const {User} = require( '../models' );

const validateJWT = async(req=request, res=response, next) => {
    const token = req.header('x-token');

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Usuario autenticado no existe en DB'
            })
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'El estado del usuario autenticado es : false'
            })
        }

        req.user = user;

        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validateJWT
}