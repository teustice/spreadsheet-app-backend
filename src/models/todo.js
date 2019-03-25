let db = require("mongoose");

import TodoSchema from '../schema/TodoSchema'

TodoSchema.methods.getTitles = function () {
    var justText = `Here is the TITLE copy of this todo: ${this.title}`;
    return justText;
}

let Todo = db.model("Todo", TodoSchema);

export default Todo;
