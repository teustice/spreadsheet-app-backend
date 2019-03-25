const mongoose = require('mongoose');

import UsersSchema from './UsersSchema'

let TodoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    user: UsersSchema
});

export default TodoSchema;
