var express = require('express')
var router = express.Router()
import Todo from '../models/todo';

// middleware that is specific to this router
router.get('/', (req, res) => {
    Todo.find(function(err, todo) {
        res.send(todo);
    })
});

//Get Todos by id
router.get('/:id', (req, res) => {
    Todo.findById(req.params.id, function(err, todo) {
        if(err) {
            res.status(400).send("A Todo with that ID does not exist " + err);
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
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database! " + err);
        });
});

//Update Todos
router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, req.body, null, function(err) {
        if(err) {
            res.status(400).send("A Todo with that ID does not exist " + err);
        } else {
            res.send('Updated Successfully');
        }
    })
});

//Delete Todos
router.delete('/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id, function(err) {
        if(err) {
            res.status(400).send("A Todo with that ID does not exist " + err);
        } else {
            res.send('Deleted Successfully');
        }
    })
});

module.exports = router