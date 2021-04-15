const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: ['ADMIN_ROLE', 'USER_ROLE'] },
    status: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);