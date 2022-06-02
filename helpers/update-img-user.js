const { User } = require( "../models" );
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

/**
 * Actualiza img de usuario en servidor externo (cloudinary)
 */
const updateImgUser = async(uid, reqImg) => {

    const user = await User.findById(uid)

    // Si el usuario ya tenia img la elimina
    if (user.img) {
        const name = user.img.split('/').at(-1)
        const [public_id] = name.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    // Sube img a servidor y retorna el path
    const { tempFilePath } = reqImg;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    return secure_url;
}

module.exports = {updateImgUser}