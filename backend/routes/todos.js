var express = require('express');
var router = express.Router();

var Todo = require('../models/task');
const auth = require('../middleware/auth');


router.delete('/delete/:id', function (req, res) {
  try {
    Todo.deleteOne({ _id: req.params.id }, (err, todo) => {
      if (err) res.status(400).send(err);
      res.json(todo);
    });
  } catch (err) {
    console.log('Error in deleting data\n', err);
  }
});


/* GET home page. */
router.get('/', auth.getUserData, function (req, res) {
  try {
    Todo.find({ username: req.username }, (err, todos) => {
      if (err) res.status(400).send(err);
      res.json(todos);
    });
  } catch (err) {
    console.log('Error in fetching tasks\n', err);
  }
});

router.get('/:id', function (req, res) {
  try {
    Todo.findById(req.params.id, (err, todo) => {
      if (err) res.status(400).send(err);
      res.json(todo.task);
    });
  } catch (err) {
    console.log('Error in finding task by ID\n', err);
  }
});

router.post('/add', auth.getUserData, async function (req, res) {
  try {
    let todo = new Todo({ task: req.body.task, username: req.username });
    await todo.save()
    return res.status(200).send(todo)
    // .then(todo => res.status(200).send(todo))
    // .catch(err => { console.log(err, "err"); return res.status(400).send(err) });
  } catch (err) {
    console.log(err, 'Error in adding task\n');
    return res.status(400).send(err)
  }
});

router.patch('/edit/:id', function (req, res) {
  try {
    Todo.findById(req.params.id, (err, todo) => {
      if (err) res.status(400);
      todo.task = req.body.task;
      todo
        .save()
        .then(todo => res.status(200).send(todo))
        .catch(err => res.status(400).send(err));
    });
  } catch (err) {
    console.log('Error in updating task by ID\n', err);
  }
});



module.exports = router;
