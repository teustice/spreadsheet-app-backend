const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UsersSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    hash: String,
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    roles: {
      admin: {type: Boolean, default: false},
      affiliate: {type: Boolean, default: true}
    },
});

UsersSchema.plugin(uniqueValidator, { message: 'is already taken' })


export default UsersSchema;
