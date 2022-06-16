const { User, Movement, Group } = require( "../models" )


const searchInCollection = async(req, res) => {
    const {collection, word} = req.params;
    const {_id:uid} = req.user;
    let model;
    const regex = new RegExp(word, 'i')

    switch (collection) {
        case 'UsersAndGroups':
            /* model = await User.find({
                $or: [{name:regex}, {email:regex}],
                $and: [{status:true}, {_id: {$ne: uid}}],
            }) */
            const users = await User.find({
                $or: [{name:regex}, {email:regex}],
                $and: [{status:true}, {_id: {$ne: uid}}],
            })
            const groups = await Group.find({name:regex})
                .populate('users')
                .populate('admin')
                .populate('creatorUser')

            model = {
                users,
                groups
            }
            break;

        case 'Movements':
            model = await Movement.find({
                // Buscar "para..." o "enviado a..."
                $or:[
                    {'from.name':regex}, 
                    {'from.email':regex}, 
                    {'to.name':regex}, 
                    {'to.email':regex}, 
                    {'routineAtSentMoment.name':regex},
                ],

            })
            .populate('routine')
            .populate({
                path: 'routineAtSentMoment',
                populate: {
                    path: 'days',
                    populate: {
                        path: 'workouts',
                        populate: {
                            path: 'combinedWorkouts',
                            populate: {
                                path: 'workout',
                                populate: {
                                    path: 'muscle'
                                }
                            }
                        }
                    }
                }
            })
            break;

        case 'groups':
            model = await Group.find({name:regex})
                .populate('users')
                .populate('admin')
                .populate('creatorUser')

            break;
    
        default:
            return res.status(404).json({
                msg: `No se puede buscar en colección ${collection}`
            });
    }

    res.status(200).json({
        results: model
    })

}

module.exports = {searchInCollection}