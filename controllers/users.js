const {response, request} = require('express')
const bcrypt = require('bcryptjs')

const {User} = require('../models');
const { generateJWT } = require( '../helpers/generate-jwt' );
const { roles } = require( '../types/roles' );


const getUsers = async(req = request, res = response) => {
    const {page = 1, limit=10} = req.query;

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res.status(404).json({
            msg: `Error el las querys enviadas, deben ser numeros`
        })
    }

    const query = {status: true}

    const [usuarios, total] = await Promise.all([
        User.find(query)
        .limit(Number(limit))
        .skip(Number(limit)*Number(page - 1)),
        User.countDocuments(query)
    ])

    res.status(200).json({
        total,
        usuarios
    })
}

const getUser = async(req = request, res = response) => {

    const {id} = req.params;

    const user = await User.findById(id)
    if (!user) {
        return res.status(400).json({
            msg: `No existe usuario con el id ${id}`
        })
    }

    res.status(200).json({
        user
    })
}

const postUsers = async(req, res) => {

    const {name, email, password, role} = req.body;

    let user;

    // Valida q exista un solo administrador
    if (role === roles.admin) {
        const adminUser = await User.findOne({role})
        if (!adminUser) {
            user = await new User({name, email, password, role})
        } else {
            return res.status(400).json({
                msg: `Ya existe un administrador`
            })
        }
    } else {
        user = await new User({name, email, password})
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt )

    // Guardar en db
    await user.save()

    // Generar JWT
    const token = await generateJWT(user._id);

    res.status(201).json({
        user,
        token
    })
}

const putUser = async(req = request, res) => {

    const {id} = req.params
    const {_id, google, password, status, role, ...rest} = req.body;

    if (password) {
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt )
    }

    const user = await User.findByIdAndUpdate(id, rest, {new:true})

    res.status(200).json( user )
}

const deleteUser = async(req, res) => {
    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id, {status:false},{new:true})

    res.status(200).json({
        user,
    })
}

module.exports = {
    getUsers,
    getUser,
    postUsers,
    putUser,
    deleteUser,
}