const { Group } = require( "../models" );

const existUserInGroup = async(req,res,next) =>{
    const {idGroup} = req.params;
    const {users=[]} = req.body

    try {

        const group = await Group.findById(idGroup)
        const existUser = group.users.find( user => users.includes(user.toString()))
        console.log(existUser);

        if (existUser) {
            return res.status(400).json({
                msg: `Uno de los usuarios ya se encuentra en el grupo`
            })
        }

        next()

    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {existUserInGroup}