// implement your API here

// require the express npm module, needs to be added to the project using "yarn add" or "npm install"
const express = require('express');

const db = require('./data/db.js');

const cors = require('cors');

// creates an express application using the express module
const server = express();

server.use(express.json());

server.use(cors());

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get('/', (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  res.send('Hello World');
});

server.get('/hobbits', (req, res) => {
  // route handler code here
  const hobbits = [
    {
      id: 1,
      name: 'Samwise Gamgee',
    },
    {
      id: 2,
      name: 'Frodo Baggins',
    },
  ];

  res.status(200).json(hobbits);
});

// GET
server.get('/api/users', (req, res) => {
  db.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'The users information could not be retrieved.' });
    });
});

// GET BY ID
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((user) => {
      if (!user) {
        throw 'INVALID_ID';
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err === 'INVALID_ID') {
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
      }

      res.status(500).json({ error: 'The user information could not be retrieved.' });
    });
});

// POST
server.post('/api/users', (req, res) => {
  const body = req.body;

  if (!body.name || !body.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  db.insert(body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: 'There was an error while saving the user to the database' });
    });
});

// DELETE
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((user) => {
      if (!user) {
        throw 'INVALID_ID';
      }

      db.remove(id).then((deleted) => {
        res.status(200).json(deleted);
      });
    })
    .catch((err) => {
      if (err === 'INVALID_ID') {
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
      }

      res.status(500).json({ error: 'The user could not be removed' });
    });
});

// PUT
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  db.findById(id)
    .then((user) => {
      if (!user) {
        throw 'INVALID_ID';
      }
      if (!body.name || !body.bio) {
        throw 'INVALID_BODY';
      }

      db.update(id, body).then((success) => {
        res.status(200).json(success);
      });
    })
    .catch((err) => {
      if (err === 'INVALID_ID') {
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
      }
      if (err === 'INVALID_BODY') {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
      }

      res.status(500).json({ error: 'The user information could not be modified.' });
    });
});

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log('API running on port 8000'));
