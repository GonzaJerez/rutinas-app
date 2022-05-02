const {User} = require( '../models' );

// Verificar si ya existe mail
const emailExist = async(email = '') => {
    const emailExist = await User.findOne({email});
    if (emailExist) {
        throw new Error(`El email ya se encuentra registrado`)
    }
}

// Verificar si existe usuario 
const userExistById = async(id) => {
    try {
        const userExist = await User.findById(id);
        if (!userExist) {
            throw new Error(`El id ${id} no existe`)
        }    
    } catch (error) {
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports = {
    emailExist,
    userExistById,
}

