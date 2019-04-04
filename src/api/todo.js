var express = require('express')
var router = express.Router()
import Todo from '../models/todo';
import User from '../models/user';

// middleware that is specific to this router
router.get('/', (req, res) => {
    Todo.find(function(err, todo) {
        res.send(todo);
    }).lean().populate('user')
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
            res.status(200).json("item saved to database");
        })
        .catch(err => {
            res.status(422).json({errors: "" + err});
        });
});

//Batch Create Todos
router.post("/batch", (req, res) => {
    Todo.insertMany(req.body)
      .then(function (docs) {
          res.json(docs);
      })
      .catch(function (err) {
          res.status(500).send(err);
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

//Batch Delete Todos
router.post("/batch-delete", (req, res) => {
    Todo.deleteMany({_id: { $in: req.body}})
      .then(function (docs) {
          res.json(docs);
      })
      .catch(function (err) {
          res.status(500).send(err);
      });
});

module.exports = router
