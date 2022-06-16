const { Schema, model } = require('mongoose')
const { tools } = require( '../types/tools' )

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
    },
    validTools: {
        type: [String],
        required: true,
        enum: tools,
        default: tools
    }
})

module.exports = model('Workout', WorkoutSchema)