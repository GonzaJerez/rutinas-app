const {Schema, model} = require('mongoose');
const { tools } = require( '../types/tools' );

const WorkoutInRoutineSchema = Schema({
    workout: {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    tool: {
        type: String,
        // enum: ['Dumbbell', 'Barbell', 'Pulley', 'free']
        enum: tools
    },
    sets: {
        type: [Schema.Types.ObjectId],
        ref: 'SetWorkout'
    },
    actualUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = model('WorkoutInRoutine', WorkoutInRoutineSchema);