const path = require('path')
const fs = require('fs')
const { uploadImg } = require( "../helpers" )
const {Muscle} = require( "../models" )


const getMuscles = async(req,res) =>{

    const query = {status:true}

    const muscles = await Muscle.find(query)

    res.status(200).json({
        muscles,
        pathImg: path.join( __dirname, '../assets/muscles/')
    })
}

const postMuscle = async(req,res) =>{
    const {name} = req.body;
    let img;

    if (req.files?.img) {
        // Crea img en servidor
        img = await uploadImg(req.files, 'muscles')
    }

    // Crea muscle en DB con el nombre e img
    const muscle = await new Muscle({name: name.toUpperCase(), img})
    muscle.save();

    res.status(200).json({
        muscle,
    })
}

const putMuscle = async(req,res)=>{
    const {id} = req.params;
    const {name} = req.body;
    let newImg;

    const muscle = await Muscle.findById(id);

    // Valida q exista muscle
    if (!muscle) {
        return res.status(404).json({
            msg:`No existe muscle con el id ${id}`
        })
    }

    // Valida si se quiere actualizar la img
    if (req.files?.img) {
        newImg = await uploadImg(req.files, 'muscles')
        // Si ya existe una img para ese músculo en servidor la elimino
        if (muscle.img) {
            const pathImg = path.join(__dirname, '../assets/muscles', muscle.img);
            // Verificar q exista img en servidor
            if (fs.existsSync(pathImg)) {
                // Eliminar img del servidor
                fs.unlinkSync(pathImg)
            }
        }
        muscle.img = newImg;
    }


    // Actualiza nombre si es recibido
    if (name) {
        muscle.name = name.toUpperCase();
    }

    // Si no se reciben argumentos para actualizar
    if (!newImg && !name) {
        return res.status(404).json({
            msg: `No se recibieron datos para actualizar muscle`
        })
    }

    await muscle.save();

    res.status(200).json({
        muscle
    })
}

const deleteMuscle = async(req,res) => {
    const {id} = req.params;

    const muscle = await Muscle.findByIdAndUpdate(id, {status:false}, {new:true})

    if (!muscle) {
        return res.status(404).json({
            msg:`No se encontró muscle con el id ${id}`
        })
    }

    res.status(200).json({
        muscle
    })
}

module.exports = {
    getMuscles,
    postMuscle,
    putMuscle,
    deleteMuscle,
}