const path = require('path')
const { v4: uuidv4 } = require('uuid');

const uploadImg = (files, extensionesValidas = ['png'], carpeta='' ) => {

    return new Promise( (resolve, reject) => {

        // Si pasa la validacion es porque existe con este nombre entonces
        // lo desestructuro
        const {img} = files;
    
        const extension = img.name.split('.').at(-1)
    
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida. - Solo ${extensionesValidas}`)
        }
    
        const nomTemp = uuidv4() + '.' + extension;
    
        // Creo el path donde lo va a guardar
        const uploadPath = path.join( __dirname, '../assets', carpeta, nomTemp);
    
        // Usa la funcion mv() para mover el archivo al path 
        img.mv(uploadPath, (err) => {
            if (err)
            return reject(err)
    
            resolve(nomTemp)
        });

    })

}

module.exports = {
    uploadImg
}