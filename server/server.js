var express = require('express')
var bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e)
  });
});

// GET request
app.get('/todos',(req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e)
  });
});

app.get('/todos/:_id',(req,res) => {
  _id = req.params._id;
  if(!ObjectID.isValid(_id)){return res.status(400).send("Id is not valid");}
  Todo.findById(_id).then((todo) => {
    if(!todo){
      return res.status(404).send("No Todo with that ID found")
    }
    // JSON.stringify(todo,undefined,2)
    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  })
});

app.listen(3000, () => {
  console.log('Started on port 3000.');
})

module.exports = {app};
