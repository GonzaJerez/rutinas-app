const { Schema, model } = require('mongoose')
const { tools } = require( '../types/tools' )

const RoutineSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    typeUnit: {
        type: String,
        default: 'kg',
    },
    creatorUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    actualUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    img:{
        type: String,
        // required: true
    },
    timer:{
        type:Number,
        default: 60000,
        required:true
    },
    days: [{
        workouts: [{
            combinedWorkouts: [{
                workout: {
                    type: Schema.Types.ObjectId,
                    ref: 'Workout',
                    // required: true
                },
                tool: {
                    type: String,
                    enum: tools
                },
                sets: [{
                    type: {
                        numReps: Number,
                        weight: Number,
                    }
                }],
            }]
        }]
    }],
    creationDate:{
        type: Number,
        required: true,
    },
    modifyDate:{
        type:Number,
        required: true
    },
    sendBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isPendingToAccept: {
        type: Boolean,
        default: false,
    }
})

module.exports = model('Routine', RoutineSchema)