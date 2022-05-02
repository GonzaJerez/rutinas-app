const { Schema, model } = require('mongoose')

const WorkoutSchema = Schema({
    name: {
        type: String,
        required: true
    },
    muscle: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Workout', WorkoutSchema)