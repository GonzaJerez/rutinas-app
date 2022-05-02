const jwt = require('jsonwebtoken');
const {User} = require( '../models' );

const validateJWT = async(token) => {
    if (token.length < 10) {
        return null;
    }

    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    const user = await User.findById( uid )

    if (user && user.status) {
        return user;
    } else {
        return false;
    }
}

module.exports = {
    validateJWT
}