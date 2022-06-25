const {Schema, model} = require('mongoose');
const { tools } = require( '../types/tools' );

const MovementSchema = Schema({
    date: {
        type: Number,
        required: true
    },
    // from: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // to: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    from: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        _id:{
            type: String,
            required: true
        },
        img:{
            type: String,
        }
    },to: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            // required: true
        },
        _id:{
            type: String,
            required: true
        },
        img:{
            type: String,
        },
        status:{
            type: String,
            required: true,
            enum: ['Accepted', 'Rejected', 'Pending'],
            default:'Pending'
        },
    }],
    routines: {
        type: [Schema.Types.ObjectId],
        ref: 'Routine',
        required: true
    },
    routineAtSentMoment:{
        name: {
            type: String,
            required: true,
        },
        typeUnit: {
            type: String,
            default: 'kg',
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
    },
})

module.exports = model('Movement', MovementSchema);