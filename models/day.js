const { Schema, model } = require('mongoose')

const DaySchema = Schema({
    numMuscles : Number,
    workouts: {
        type: [Schema.Types.ObjectId],
        ref: 'WorkoutInRoutine'
    },
    actualUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = model('DayWorkout', DaySchema);