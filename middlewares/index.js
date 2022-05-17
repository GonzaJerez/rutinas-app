const validateFields = require( './validate-fields' );
const validarJWT = require( './validar-jwt' );
const validateOwnerUser = require( './validate-owner-user' );
const existRoutineWithSameName = require( './existRoutineWithSameName' );
const existWorkoutWithSameName = require( './existWorkoutWithSameName' );
const existMuscleWithSameName = require( './existMuscleWithSameName' );
const existWorkout = require( './exist-workout' );




module.exports ={
    ...validateFields,
    ...validarJWT,
    ...validateOwnerUser,
    ...existRoutineWithSameName,
    ...existWorkoutWithSameName,
    ...existMuscleWithSameName,
    ...existWorkout
}