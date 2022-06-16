const {Schema, model} = require('mongoose')

const GroupSchema = Schema({
    name:{
        type: String,
        required: true
    },
    users:{
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creatorUser:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    img:{
        type: String,
    },
    description:{
        type: String
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    creationDate:{
        type: Number,
        required: true
    },
    modifyDate:{
        type: Number,
        required: true
    }
})

module.exports = model('Group', GroupSchema)