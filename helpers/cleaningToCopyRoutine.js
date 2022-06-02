const { Routine } = require( "../models" );

/**
 * Limpia la rutina de todos los _id's y elije nombre para la copia de la rutina
 * para poder crear una nueva rutina a partir de la anterior
 */
const cleaningToCopyRoutine = async(routine) => {

    routine = await setNameToCopy(routine)
    routine = cleaningIdsRoutine(routine)
    
    // Retorna la rutina sin el _id, ni __V, ni las fechas de creación o modificación
    return {
        name: routine.name,
        typeUnit: routine.typeUnit,
        img: routine.img,
        days: routine.days,
        creatorUser: routine.creatorUser.toString(),
        actualUser: routine.actualUser.toString(),
    };
}

module.exports = {cleaningToCopyRoutine}



/**
 * Elige nombre para la rutina nueva en base a la anterior y las copias ya creadas
 */
const setNameToCopy = async(routine)=>{
    // Si el nombre no incluye la palabra "copia"...
    if (!routine.name.includes('copia')) {
        // Busca si ya se creo una primera copia de la rutina
        const existRoutineFirstCopy = await Routine.findOne({actualUser:routine.actualUser, name:`${routine.name} copia`})
        // Si todavía no se creo ninguna copia...
        if (!existRoutineFirstCopy) {
            // Crea el nombre de la primera copia
            routine.name = `${routine.name} copia`
        } else {
            // Sino va buscando entre las rutinas el numero de la siguiente copia
            let contador = 1;
            let existSomeRoutine;
            do {
                // Busca en DB si existe rutina con nombre de rutina anterior y el nuevo número de copia
                // Ej: "Rutina 2 copia 2"
                existSomeRoutine = await Routine.findOne({actualUser:routine.actualUser, name:`${routine.name} copia ${contador}`})
                // Si ya existe entonces saltea al siguiente nímero de copia
                if (existSomeRoutine) {
                    contador++
                    continue;
                }
                // Si no existe se almacena con ese nombre
                routine.name = `${routine.name} copia ${contador}`
                
            } while (existSomeRoutine);
        }
    } else {
        // Si termina con la palabra "copia" la nueva va a ser "copia 1"
        if (routine.name.endsWith('copia')) {
            routine.name = `${routine.name} 1`
        }

        // Almacena el nombre de la rutina antes de la copia y el número
        const nameRoutine = routine.name.slice(0,routine.name.lastIndexOf('copia'))

        // Transforma cada palabra del nombre de la rutina en un elemento en array
        const routineNameToArray = routine.name.split(' ')

        // Si la anteultima palabra es "copia"...
        if (routineNameToArray[routineNameToArray.length - 2] === 'copia') {
            // Va buscando entre las rutinas el numero de la siguiente copia
            let contador = 1;
            let existSomeRoutine;
            do {
                // Busca en DB si existe rutina con nombre de rutina anterior y el nuevo número de copia
                // Ej: "Rutina 2 copia 2"
                existSomeRoutine = await Routine.findOne({actualUser:routine.actualUser, name:`${nameRoutine}copia ${contador}`})
                // Si ya existe entonces saltea al siguiente nímero de copia
                if (existSomeRoutine) {
                    contador++
                    continue;
                }
                // Si no existe se almacena con ese nombre
                routine.name = `${nameRoutine}copia ${contador}`
                
            } while (existSomeRoutine); 

        } else{
            // Si existe la palabra "copia" en el nombre de rutina pero no es la anteultima palabra, osea no indica copia en sí
            // Almacena el nombre actual de la rutina con un "copia" al final
            routine.name = `${routine.name} copia`
        }
    }

    return routine;
}


/**
 * Elimina los id's de todos los subdocumentos
 */
const cleaningIdsRoutine = (routine) => {
    // Si existen days entonces les saca el id a c/u y retorna el resto del day
    if (routine.days) {
        routine.days = routine.days.map( day => {

            // Si existen workouts entonces les saca el id a c/u y retorna el resto del workout
            if(day.workouts){
                day.workouts = day.workouts.map( combinedWork => (
                    combinedWork.map( work => {

                        // Si existen los sets entonces les saca el id a c/u y retorna el resto del set
                        if (work.sets) {
                            work.sets = work.sets.map( set => ({numReps:set.numReps, weight: set.weight}))
                        }
                        
                        return {tool: work.tool, workout:work.workout || '', sets: work.sets}
                    })
                ))
            }
            return {workouts: day.workouts}
        })
    }

    return routine;
}