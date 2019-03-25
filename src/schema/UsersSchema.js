const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    email: String,
    hash: String,
    salt: String,
});

export default UsersSchema;
