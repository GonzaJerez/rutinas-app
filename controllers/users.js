const {response, request} = require('express')
const bcrypt = require('bcryptjs')

const {User, Routine} = require('../models');
const { generateJWT } = require( '../helpers/generate-jwt' );
const { roles } = require( '../types/roles' );
const { updateImgUser } = require( '../helpers' );
const { defaultInit } = require( '../assets/defaultRoutines/defaultInit' );


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
    const emailLower = email.toLowerCase()

    // Valida que el email no se encuentre registrado
    const existUser = await User.findOne({email:emailLower})
    if (existUser) {
        let msgError;
        if (existUser.google) {
            msgError = `El usuario ya se encuentra registrado con google`
        } else {
            msgError = `El usuario ya se encuentra registrado`
        }
        return res.status(400).json({
            msg: msgError
        })
    }

    let user;

    // Valida q exista un solo administrador
    if (role === roles.admin) {
        const adminUser = await User.findOne({role})
        if (!adminUser) {
            user = await new User({name, email:emailLower, password, role})
        } else {
            return res.status(400).json({
                msg: `Ya existe un administrador`
            })
        }
    } else {
        user = await new User({name, email:emailLower, password})
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt )

    // Guardar en db
    await user.save()

    // Generar JWT
    const token = await generateJWT(user._id);

    // Crear primera rutina por default
    const assingUser = {
        creatorUser: user._id,
        actualUser: user._id
    }

    const dateNow = Date.now()
    const dates = {
        creationDate: dateNow,
        modifyDate: dateNow
    }

    const routine = await new Routine({...defaultInit, ...assingUser, ...dates})
    await routine.save()

    res.status(201).json({
        user,
        token
    })
}

const putUser = async(req = request, res) => {

    const {id} = req.params
    const {_id, google, actualPassword, newPassword, status, role, email1, email2, ...rest} = req.body;

    if (newPassword) {
        const isValidPass = bcrypt.compareSync(actualPassword, user.password)
        if (!isValidPass) {
            return res.status(404).json({
                msg:`Contraseña incorrecta`
            })
        }
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(newPassword, salt )
    }

    if (req.files?.img) {
        rest.img = await updateImgUser(id, req.files.img)
    }

    
    if (email1 && email2) {
        const email1Lower = email1.toLowerCase();
        const email2Lower = email2.toLowerCase();
        if (email1Lower !== email2Lower) {
            return res.status(404).json({
                msg: `Los emails introducidos no son iguales`
            })
        }
        rest.email = email1Lower
    }

    const user = await User.findByIdAndUpdate(id, rest, {new:true})

    res.status(200).json( {user} )
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