const existMuscleWithSameName = require( './existMuscleWithSameName' );
const existRoutineWithSameName = require( './existRoutineWithSameName' );
const existUserInGroup = require( './existUserInGroup' );
const existWorkoutWithSameName = require( './existWorkoutWithSameName' );
const isAdminGroup = require( './isAdminGroup' );
const validarJWT = require( './validar-jwt' );
const validateFields = require( './validate-fields' );
const validateNumRepsSets = require( './validate-numReps-sets' );
const validateOwnerUser = require( './validate-owner-user' );
const validateTool = require( './validate-tool' );
const validateWorkout = require( './validate-workout' );


module.exports ={
    ...existMuscleWithSameName,
    ...existRoutineWithSameName,
    ...existUserInGroup,
    ...existWorkoutWithSameName,
    ...isAdminGroup,
    ...validarJWT,
    ...validateFields,
    ...validateNumRepsSets,
    ...validateOwnerUser,
    ...validateTool,
    ...validateWorkout,
}