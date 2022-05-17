const { Schema, model } = require('mongoose')

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
    // days:{
    //     type: Number,
    //     required: true
    // },
    img:{
        type: String,
        required: true
    },
    routine: {
        type: [Schema.Types.ObjectId],
        ref: 'DayWorkout'
    },
    creationDate:{
        type: Number,
        required: true,
    },
    lastUser:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isPendingToAccept: {
        type: Boolean,
        default: false,
    }
})

module.exports = model('Routine', RoutineSchema)