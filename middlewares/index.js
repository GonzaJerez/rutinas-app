const validateFields = require( './validate-fields' );
const validarJWT = require( './validar-jwt' );
const validateOwnerUser = require( './validate-owner-user' );
const existRoutineWithSameName = require( './existRoutineWithSameName' );
const existWorkoutWithSameName = require( './existWorkoutWithSameName' );
const existMuscleWithSameName = require( './existMuscleWithSameName' );
const validateNumRepsSets = require( './validate-numReps-sets' );
const validateWorkout = require( './validate-workout' );
const validateTool = require( './validate-tool' );


module.exports ={
    ...validateFields,
    ...validarJWT,
    ...validateOwnerUser,
    ...existRoutineWithSameName,
    ...existWorkoutWithSameName,
    ...existMuscleWithSameName,
    ...validateNumRepsSets,
    ...validateWorkout,
    ...validateTool
}