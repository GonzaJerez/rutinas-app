const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise((res,rej) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '365 days'
        }, (err, encoded) => {
            if (err) {
                console.log(err);
                rej('No se pudo generar el jwt')
            } else {
                res(encoded)
            }
        })
    })
}

module.exports = {
    generateJWT,
}