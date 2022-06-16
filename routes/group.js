const {Router} = require('express')
const { check } = require( 'express-validator' )
const { getGroups, getGroup, postGroup, putGroup, deleteGroup, deleteUsers, addUsers, getRoutineByGroup, leaveGroup } = require( '../controllers/group' )
const { validateJWT, validateFields, isAdminGroup, existUserInGroup } = require( '../middlewares' )

const router = Router()

router.get('/',[
    validateJWT,
], getGroups)


router.get('/:idGroup',[
    validateJWT,
    check('idGroup', 'El id del grupo no es reconocido como un id de Mongo').isMongoId(),
    validateFields
], getGroup)

router.get('/:idGroup/routines',[
    validateJWT,
    check('idGroup', 'El id del grupo no es reconocido como un id de Mongo').isMongoId(),
    validateFields
], getRoutineByGroup)


router.post('/',[
    validateJWT,
    check('name', 'El name es obligatorio').notEmpty(),
    validateFields
], postGroup)


router.put('/:idGroup',[
    validateJWT,
    check('idGroup', 'El id no es reconocido como un id de Mongo').isMongoId(),
    isAdminGroup,
    validateFields,
], putGroup)


router.delete('/:idGroup',[
    validateJWT,
    check('idGroup', 'El id no es reconocido como un id de Mongo').isMongoId(),
    isAdminGroup,
    validateFields,
], deleteGroup)

router.post('/:idGroup/addUsers',[
    validateJWT,
    check('idGroup', 'El id no es reconocido como un id de Mongo').isMongoId(),
    check('users', 'Los usuarios a agregar deben estar en un array').isArray(),
    check('users', 'Debe existir por lo menos un usuario para agregar').isLength({min:1}),
    isAdminGroup,
    existUserInGroup,
    validateFields,
], addUsers)

router.delete('/:idGroup/deleteUsers',[
    validateJWT,
    check('idGroup', 'El id no es reconocido como un id de Mongo').isMongoId(),
    check('users', 'Los usuarios a eliminar deben estar en un array').isArray(),
    check('users', 'Debe existir por lo menos un usuario para eliminar').isLength({min:1}),
    isAdminGroup,
    validateFields,
], deleteUsers)

router.delete('/:idGroup/leaveGroup',[
    validateJWT,
    check('idGroup', 'El id no es reconocido como un id de Mongo').isMongoId(),
    validateFields
], leaveGroup)




module.exports = router;