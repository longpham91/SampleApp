var express = require('express');
var pg      = require('pg');

var TodoCtroller     = require('./routes/todo');


var app = express();
var router  = express.Router();

app.use(router);

router.post('/api/v1/todos', TodoCtroller.post);
router.get('/api/v1/todos', TodoCtroller.get);
router.put('/api/v1/todos/:todo_id', TodoCtroller.put);
router.delete('/api/v1/todos/:todo_id', TodoCtroller.delete);

module.exports = app;