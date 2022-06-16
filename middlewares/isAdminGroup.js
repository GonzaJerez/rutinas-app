const { Group } = require( "../models" );

const isAdminGroup = async(req,res,next) => {
    const {idGroup} = req.params;
    const {_id: uid}     = req.user;

    const group = await Group.findById(idGroup)

    if (group.admin.toString() !== uid.toString()) {
        return res.status(400).json({
            msg: `No tienes los permisos de administrador`
        })
    }
    
    next()
}

module.exports = {isAdminGroup}