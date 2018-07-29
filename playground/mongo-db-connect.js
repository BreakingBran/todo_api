const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) => {
  if(err){
    return console.log(err);
    // return console.log('could not connect to mongo server');
  }
  const db = client.db()
  console.log('Connected to Mongo server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err,res) => {
  //   if(err){
  //     console.log('Unable to insert todo', err)
  //   }
  //   console.log(JSON.stringify(res.ops,undefined,2));
  // });

  db.collection('Users').insertOne({
    name: 'Lanka',
    age: 91,
    location: '90210'
  }, (err,res) => {
    if(err){
      console.log('Unable to insert user', err)
    }
    console.log(JSON.stringify(res.ops,undefined,2));
  });

  client.close();
})
