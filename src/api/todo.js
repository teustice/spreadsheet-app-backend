var express = require('express')
var router = express.Router()
import Todo from '../models/todo';
import User from '../models/user';

// middleware that is specific to this router
router.get('/', (req, res) => {
    Todo.find(function(err, todo) {
        todo.user = User.findById(todo.userId)
        console.log(todo);
        res.send(todo);
    })
});

//Get Todos by id
router.get('/:id', (req, res) => {
    Todo.findById(req.params.id, function(err, todo) {
        if(err) {
            res.status(422).json({errors: "" + err});
        } else {
            res.send(todo);
        }
    })
});

//Create Todos
router.post("", (req, res) => {
    let todo = new Todo(req.body);
    todo.save()
        .then(item => {
            res.json("item saved to database");
        })
        .catch(err => {
            res.status(422).json({errors: "" + err});
        });
});

//Update Todos
router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, req.body, null, function(err) {
        if(err) {
            res.status(422).json({errors: "" + err});
        } else {
            res.json('Updated Successfully');
        }
    })
});

//Delete Todos
router.delete('/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id, function(err) {
        if(err) {
            res.status(422).json({errors: "" + err});
        } else {
            res.json('Deleted Successfully');
        }
    })
});

module.exports = router
