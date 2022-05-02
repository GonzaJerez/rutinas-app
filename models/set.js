const { Schema, model } = require('mongoose')

const SetSchema = Schema({
    numReps: Number,
    weight: Number,
    actualUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = model('SetWorkout', SetSchema);