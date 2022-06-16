const { User, Group } = require( "../models" );
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

const updateImgGroup = async(idGroup, reqImg) => {
    const group = await Group.findById(idGroup)

    // Si el usuario ya tenia img la elimina
    if (group.img) {
        const name = group.img.split('/').at(-1)
        const [public_id] = name.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    // Sube img a servidor y retorna el path
    const { tempFilePath } = reqImg;
    console.log({tempFilePath});
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    console.log({secure_url});

    return secure_url;
}

module.exports = {
    updateImgUser,
    updateImgGroup
}