require('./config/config');
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middelware/authenticate.js');

const port = process.env.PORT;

// App
//Hello james, I really love vim

const app = express();

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

app.delete('/todos/:_id',(req,res) => {
  _id = req.params._id;
  if(!ObjectID.isValid(_id)){return res.status(400).send("Id is not valid");}
  Todo.findByIdAndRemove(_id).then((todo) => {
    if(!todo){
      return res.status(404).send("No Todo with that ID found")
    }
    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  })
});

app.patch('/todos/:_id', (req,res) => {
  var _id = req.params._id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(_id)){return res.status(400).send("Id is not valid");}

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(_id,{$set: body},{new: true}).then(todo => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send()
  })

})

app.post('/users',(req,res) => {
  var user = new User(_.pick(req.body,['email','password']));
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  })
});


// GET /users/me
app.get('/users/me', authenticate,(req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
})

module.exports = {app};
