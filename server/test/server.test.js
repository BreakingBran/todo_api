const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todo');

todos = [{
  _id: new ObjectID(),
  text: 'First'
}, {
  _id: new ObjectID(),
  text: 'Second',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {

    var text = "Some random data";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        Todo.find({text: text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  })

  it('should not create a new todo with invalid data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  })
})

describe('GET /todos', () => {
  it('should show the two seeded todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:_id', () => {

  it('should be an invalid id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe("Id is not valid")
      })
      .end(done)
  });

  it('should not find the id', (done) => {
    request(app)
      .get(`/todos/${new ObjectID()}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe("No Todo with that ID found")
      })
      .end(done)
  });

  it('should find the valid id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });
});

describe('DELETE /todos/:_id', () => {
  var deletedId = new ObjectID();

  it('should be an invalid id', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe("Id is not valid")
      })
      .end(done)
  });

  it('should not find the non existant id', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe("No Todo with that ID found")
      })
      .end(done)
  });

  it('should find and delete the valid id', (done) => {
    var text = "Im going to be deleted"
    var dyingTodo = new Todo({_id:deletedId,text});
    dyingTodo.save();
    request(app)
      .delete(`/todos/${deletedId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(ObjectID(res.body.todo._id)).toEqual(deletedId)
      })
      .end((err,res) => {
        Todo.findById(deletedId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      })
  });

});


describe('PATCH /todos/:_id', () => {
  var text = "updated :)";
  var completed = true;

  it('should update the todo',(done) => {
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .send({completed,text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeTruthy();
      })
      .end(done)
  })


  it('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id}`)
      .send({"completed":false,text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done)
  })
})
