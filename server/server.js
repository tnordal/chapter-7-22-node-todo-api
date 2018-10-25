var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  // Get the id
  var id = req.params.id;

  // Validate the id - not valid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalide ID');
  };

  // Remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // success
      // if no doc, send 404
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      // if doc, send doc back with 200
      res.status(200).send({todo});
  }).catch((e) => {
    // error
      // 400 with empty body
      res.status(400).send('Somthing got wrong');
  });

});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
