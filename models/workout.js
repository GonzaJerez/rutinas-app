const { Schema, model } = require('mongoose')

const WorkoutSchema = Schema({
    name: {
        type: String,
        required: true
    },
    muscle: {
        type: Schema.Types.ObjectId,
        ref: 'Muscle',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
    }
})

module.exports = model('Workout', WorkoutSchema)