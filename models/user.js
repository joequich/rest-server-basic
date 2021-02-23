const { Schema, model} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} isn\'t a valid role'
}

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// userSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     return userObject;
// }

// userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.'})

module.exports = model('User', userSchema);