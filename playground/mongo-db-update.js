const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) => {
  if(err){
    return console.log(err);
    // return console.log('could not connect to mongo server');
  }
  const db = client.db()
  console.log('Connected to Mongo server');

  // https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/#db.collection.findOneAndDelete

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b5d01e422387e1bb08ed60f')
  },{
    $set: {
      name: "Lance Pereira"

    },
    $inc: {
      age: 1
    }
  },{
    returnOriginal: false
  }
  ).then((res) => {
    console.log('sucess',res);
  },(err) => {
    console.log('error',err);
  })

})
