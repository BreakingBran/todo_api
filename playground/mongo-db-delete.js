const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) => {
  if(err){
    return console.log(err);
    // return console.log('could not connect to mongo server');
  }
  const db = client.db()
  console.log('Connected to Mongo server');

  // https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/#db.collection.findOneAndDelete

  db.collection('Todos').findOneAndDelete({completed: true}).then((res) => {
    console.log('sucess',res);
  },(err) => {
    console.log('error',err);
  })

})
