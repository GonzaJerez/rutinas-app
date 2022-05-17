const {Schema, model} = require('mongoose')

const MuscleSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String
    }
})

module.exports = model('Muscle', MuscleSchema);