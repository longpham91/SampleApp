var express      = require('express');
var app          = express();
var router       = express.Router();
var bodyParser   = require('body-parser');
var TodoCtroller = require('./routes/todo');

/**
 * Services
 *
 * @type {*|exports|module.exports}
 */
app.use(require('./tedious-service-provider'));

/**
 * Routing & middlewares
 */
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json({ extended: true }));
app.use(router);

router.post('/api/v1/todos', TodoCtroller.post);
router.get('/api/v1/todos', TodoCtroller.get);
router.put('/api/v1/todos/:todo_id', TodoCtroller.put);
router.delete('/api/v1/todos/:todo_id', TodoCtroller.delete);

module.exports = app;