const {User, Muscle} = require( '../models' );

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

// Verificar si existe músculo
const muscleExistById = async(id) => {
    try{
        const muscleExist = await Muscle.findById(id);
        if (!muscleExist) {
            throw new Error(`No existe músculo con el id ${id}`)
        }
    } catch (err){
        throw new Error(`No existe músculo con el id ${id}`)
    }
}


module.exports = {
    emailExist,
    userExistById,
    muscleExistById
}

