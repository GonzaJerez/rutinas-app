const { Schema, model } = require('mongoose');
const { roles } = require( '../types/roles' );

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de usuario es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: [roles.admin, roles.user],
        default: roles.user
    },
    movements: {
        type: [Schema.Types.ObjectId],
        ref: 'Movements',
    }
})

UserSchema.methods.toJSON = function(){
    const { __v, password, _id:uid, ...user} = this.toObject();
    return {
        ...user,
        uid
    };
}

module.exports = model('User', UserSchema );