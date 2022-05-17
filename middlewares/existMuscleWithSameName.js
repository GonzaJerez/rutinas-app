const { Muscle } = require( "../models" );


const existMuscleWithSameName = async(req, res, next) => {
    let {name} = req.body;

    if (name) {
        name = name.toUpperCase();
    
        const exist = await Muscle.findOne({name, status:true})
    
        if (exist) {
            return res.status(400).json({
                msg: `Ya existe un músculo llamado ${name}`
            })
        }
    }

    next()
}

module.exports = {
    existMuscleWithSameName
}