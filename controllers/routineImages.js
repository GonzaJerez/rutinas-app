const path = require('path')
const fs = require('fs')

const getImages = async(req,res) => {
    let imagesList=[]
    let counter = 1;

    do {
        // Construye path sumandole 1 al nombre del archivo en cada iteración
        const imagePath = path.join(__dirname, `../assets/routines/routine${counter}.png` )

        // Valida si en esta iteración no se encontró archivo con ese path (osea que no hay más imagenes)
        if( !fs.existsSync(imagePath)){
            break;
        }

        // Agrega el nombre de la img + extensión al array e incrementa el contador
        imagesList.push(`routine${counter}.png`)
        counter++;
        
    } while (true);

    res.json({
        imagesList
    })
}

const getImage = async(req,res) => {
    const {id} = req.params;

    // Crea el path completo de la ubicación de la imagen
    const imagePath = path.join(__dirname,  `../assets/routines/${id}`)

    if( !fs.existsSync(imagePath)){
        return res.status(404).json({
            msg: `No se encontró img con id ${id}`
        });
    }

    // Retorna la imagen, llamando a esta en el frontend ruta veo la imagen 
    res.sendFile(imagePath)
}

module.exports = {
    getImages,
    getImage
}