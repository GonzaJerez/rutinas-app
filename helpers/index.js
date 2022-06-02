const dbValidation =    require('./db-validation')
const generateJWT =     require('./generate-jwt')
const validateJWT =     require('./validate-jwt')
const googleVerify =    require('../helpers/google-verify')
const uploadImg =       require( './upload-img' )
const updateImgUser =   require( './update-img-user' )
const cleaningToCopyRoutine = require( './cleaningToCopyRoutine' )


module.exports = {
    ...dbValidation,
    ...generateJWT,
    ...validateJWT,
    ...googleVerify,
    ...uploadImg,
    ...updateImgUser,
    ...cleaningToCopyRoutine
}