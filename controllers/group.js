const { Group, Routine } = require( "../models" );
const { isValidObjectId } = require('mongoose');
const { updateImgGroup } = require( "../helpers" );


/**
 * Obtiene todos los grupos a los que pertenece el usuario que hace la petición
 */
const getGroups = async(req,res) => {
    const {page = 1, limit=10} = req.query;
    const {_id: uid} = req.user;
    const queryByGroupUser = {users: uid}

    // Valida que las querys recibidas sean números
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, deben ser numeros`
        })
    }

    try {
        const [total, groups] = await Promise.all([
            await Group.countDocuments(queryByGroupUser),
            await Group.find(queryByGroupUser)
                .sort({modifyDate: 'desc'})
                .limit(Number(limit))
                .skip(Number(limit)*Number(page - 1))
                .populate('users')
                .populate('admin')
                .populate('creatorUser')
        ])

        res.status(200).json({
            page,
            limit,
            total,
            groups
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

const getRoutineByGroup = async(req,res)=>{
    const {page = 1, limit=10} = req.query;
    // const {_id: uid} = req.user;
    const {idGroup} = req.params;

    const queryByGroup = {group:idGroup}

    // Valida que las querys recibidas sean números
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error en las querys enviadas, deben ser numeros`
        })
    }

    try {
        const [total, routines] = await Promise.all([
            await Routine.countDocuments(queryByGroup),
            await Routine.find(queryByGroup)
                .sort({modifyDate: 'desc'})
                .limit(Number(limit))
                .skip(Number(limit)*Number(page - 1))
                .populate('actualUser', ['name', 'email'])
                .populate('creatorUser', ['name', 'email'])
                .populate({
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
                })
        ])

        res.status(200).json({
            page,
            limit,
            total,
            routines
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

/**
 * Obtiene grupo por id
 */
const getGroup = async(req,res) =>{
    const {idGroup} = req.params;

    try {
        const group = await Group.findById(idGroup)
            .populate('users')
            .populate('admin')
            .populate('creatorUser')
    
        if (!group) {
            return res.status(404).json({
                msg: `No existe grupo con el id ${idGroup}`
            })
        }
    
        res.status(200).json({
            group
        })
        
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }

}

/**
 * Crea grupo 
 * En "rest" van el name y description
 */
const postGroup = async(req,res) =>{
    const {status, users=[], ...rest} = req.body;
    const {_id: uid} = req.user;

    // Validar que todos los usuarios recibidos sean ids válidos de Mongo
    const validUsers = users.map( user => isValidObjectId(user._id) )
    if (validUsers.some( el => el === false)) {
        return res.status(400).json({
            msg: `Ocurrio un error con los ids de los usuarios`
        })
    }

    const dateNow = Date.now()

    users.unshift(uid)
    const admin = uid;
    const creatorUser = uid;
    const creationDate = dateNow;
    const modifyDate = dateNow;

    try {
        const group = await new Group({...rest, status:true, users, admin, creatorUser, creationDate, modifyDate})
    
        await Promise.all([
            group.populate('users'),
            group.populate('admin'),
            group.populate('creatorUser'),
        ])
        
        await group.save();
    
        res.status(200).json({
            group
        })
        
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }

}

/**
 * Actualiza grupo 
 * En "rest" pueden ir el name, img, description
 */
const putGroup = async(req,res) =>{
    const {idGroup} = req.params;
    const {_id, creatorUser, creationDate, status, ...rest} = req.body;
    const modifyDate = Date.now();

    if (req.files?.img) {
        rest.img = await updateImgGroup(idGroup, req.files.img)
    }

    try {
        const group = await Group.findByIdAndUpdate(idGroup,{...rest, modifyDate}, {new: true})
            .populate('users')
            .populate('admin')
            .populate('creatorUser')
    
        res.status(200).json({
            group
        })
        
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }

}

/**
 * Eliminar grupo (cambiar status a false)
 */
const deleteGroup = async(req,res) =>{
    const {idGroup} = req.params;

    try {
        const group = await Group.findByIdAndDelete(idGroup)
    
        res.status(200).json({
            group
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

const addUsers = async(req,res) => {
    const {idGroup} = req.params;
    // const {_id:uid} = req.user;
    const {users=[]} = req.body

    // Validar que todos los usuarios recibidos sean ids válidos de Mongo
    const validUsers = users.map( uid => isValidObjectId(uid) )
    if (validUsers.some( el => el === false)) {
        return res.status(400).json({
            msg: `Ocurrio un error con los ids de los usuarios`
        })
    }

    try {
        const group = await Group.findById(idGroup)
            .populate('admin')
            .populate('creatorUser')

        // Agrega los usuarios enviados por el cliente
        group.users = [...group.users, ...users]

        await group.populate('users')
        await group.save()
    
        res.status(200).json({
            group
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

/**
 * Eliminar usuarios siendo admin 
 */
const deleteUsers = async(req,res) => {
    const {idGroup} = req.params;
    // const {_id:uid} = req.user;
    const {users=[]} = req.body

    // Validar que todos los usuarios recibidos sean ids válidos de Mongo
    const validUsers = users.map( uid => isValidObjectId(uid) )
    if (validUsers.some( el => el === false)) {
        return res.status(400).json({
            msg: `Ocurrio un error con los ids de los usuarios`
        })
    }

    try {
        const group = await Group.findById(idGroup)
            .populate('admin')
            .populate('creatorUser')

        // Filtra los usuarios enviados por el cliente
        group.users = group.users.filter( uid => !users.includes(uid.toString()) && uid )

        await group.populate('users')
        await group.save()
    
        res.status(200).json({
            group
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

const leaveGroup = async(req,res) => {
    const {idGroup} = req.params;
    const {_id:uid} = req.user;

    try {
        const group = await Group.findById(idGroup)
            .populate('creatorUser')
        
        console.log(group);

        // Elimina de los users del grupo al usuario que hace la petición
        group.users = group.users.filter( userId => userId.toString() !== uid.toString() && userId )

        if (group.admin.toString() === uid.toString()) {
            group.admin = group.users[0]
        }

        await group.populate('users')
        await group.populate('admin')
        await group.save()
    
        res.status(200).json({
            group
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getGroups,
    getRoutineByGroup,
    getGroup,
    postGroup,
    putGroup,
    deleteGroup,
    addUsers,
    deleteUsers,
    leaveGroup
}