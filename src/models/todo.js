let db = require("mongoose");

let todoSchema = new db.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    userId: {type: Number, required: true}
});

todoSchema.methods.getTitles = function () {
    var justText = `Here is the TITLE copy of this todo: ${this.title}`;
    return justText;
}

let Todo = db.model("Todo", todoSchema);

export default Todo;
