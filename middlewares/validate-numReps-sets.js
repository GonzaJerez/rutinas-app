const validateNumRepsSets = (req,res,next) => {
    const {days, workouts, sets} = req.body;
    let isNumRepsEmpty = false;

    // Si envían los sets desde la creación de rutina entra aca y valida
    if (days){
        days.map( day => {
            if (!day.workouts) return;
    
            day.workouts.map( workout => {
                if(!workout.combinedWorkouts) return;

                workout.combinedWorkouts.map( work => {
                    if(!work.sets) return;
                    
                    work.sets.map( set => {
                        if (set.numReps === '' || set.numReps.lenght === 0 || !set.numReps ) {
                            return isNumRepsEmpty = true;  
                        }
                    })
                })
            })
        })
    }

    // Si envían los sets desde la creación de un día entra aca y valida
    if (workouts) {
        workouts.map( workout => {
            if(!workout.combinedWorkouts) return;

            workout.combinedWorkouts.map(work => {
                if(!work.sets) return;
    
                work.sets.map( set => {
                    if (set.numReps === '' || set.numReps.lenght === 0 || !set.numReps ) {
                        return isNumRepsEmpty = true;  
                    }
                })
            })
        })
    }

    // Si envían los sets desde la creación de un ejercicio entra aca y valida
    if (sets) {
        sets.map( set => {
            if (set.numReps === '' || set.numReps.lenght === 0 || !set.numReps ) {
                return isNumRepsEmpty = true;
            }
        })
    }


    if (isNumRepsEmpty) {
        return res.status(404).json({
            msg: `Las cantidades de repes no pueden quedar vacías`
        })
    }

    next()
}

module.exports = {
    validateNumRepsSets
}