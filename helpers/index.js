const dbValidation = require('./db-validation')
const generateJWT = require('./generate-jwt')
const validateJWT = require('./validate-jwt')
// const googleVerify = require('../helpers/google-verify')

module.exports = {
    ...dbValidation,
    ...generateJWT,
    ...validateJWT,
    // ...googleVerify,
}