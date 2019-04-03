const mongoose = require('mongoose');

import UsersSchema from './UsersSchema'

let TodoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
});

export default TodoSchema;
