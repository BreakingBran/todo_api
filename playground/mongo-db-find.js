const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) => {
  if(err){
    return console.log(err);
    // return console.log('could not connect to mongo server');
  }
  const db = client.db()
  console.log('Connected to Mongo server');

  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs,undefined,2));
  }, (err) => {
    console.log('Unable to fetch todos',err)
  })

})
