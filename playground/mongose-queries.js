const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {ObjectID} = require('mongodb');

var _id = "5b613212474488035c888590"

if(!ObjectID.isValid(_id)){console.log("ID is not valid");}

Todo.find({
  _id
}).then((todos) => {
  if(todos.length == 0) return console.log("No todo found");
  console.log("Todos are: ", todos);
})


Todo.findOne({
  _id
}).then((todo) => {
  if(!todo) return console.log("No todo found");
  console.log("Todo is: ", todo);
})


Todo.findById({
  _id
}).then((todo) => {
  if(!todo) return console.log("No todo found");
  console.log("Todos by id are: ", todo);
}).catch((e) => {
  console.log(e);
})
