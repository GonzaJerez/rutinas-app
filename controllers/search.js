const { User, Movement } = require( "../models" )


const searchInCollection = async(req, res) => {
    const {collection, word} = req.params;
    const {_id:uid} = req.user;
    let model;
    const regex = new RegExp(word, 'i')

    switch (collection) {
        case 'Users':
            model = await User.find({
                $or: [{name:regex}, {email:regex}],
                $and: [{status:true}, {_id: {$ne: uid}}],
                
            })
            break;

        case 'Movements':
            model = Movement.find({
                // Buscar "para..." o "enviado a..."
                // $or: [{name:regex}, {email:regex}],
                // $and: [{status:true}]
            })
            break;
    
        default:
            return res.status(404).json({
                msg: `No se puede buscar en colección ${collection}`
            });
    }

    // Si no es un ID de Mongo entonces busca por nombre o correo

    res.status(200).json({
        results: model
    })

}

module.exports = {searchInCollection}