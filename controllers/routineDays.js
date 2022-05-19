const { Routine } = require( "../models" );

const postDay = async(req,res) => {
    const {idRoutine} = req.params;
    const body = req.body;

    const routine = await Routine.findById(idRoutine);

    routine.days = [...routine.days, body]

    await routine.save()

    res.json({
        routine
    })
}

const deleteDay = async(req,res) => {
    const {idRoutine, idDay} = req.params;

    const routine = await Routine.findById(idRoutine);

    routine.days = routine.days.filter( day => day._id.toString() !== idDay && day)

    await routine.save()

    res.json({
        routine
    })
}


module.exports = {
    postDay,
    deleteDay,
}