const {Schema, model} = require('mongoose')

const MovementSchema = Schema({
    date: {
        type: Number,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routine: {
        type: Schema.Types.ObjectId,
        ref: 'Routine',
        required: true
    },
    status:{
        type: String,
        enum: 'Accepted' | 'Rejected' | 'Pending',
        required: true,
        default:'Pending'
    }
})

module.exports = model('Movement', MovementSchema);