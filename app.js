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
router.get('/api/v1/todos_test', TodoCtroller.test1);
router.get('/api/v1/todos_test/:todo_id', TodoCtroller.test2);
router.get('/api/v1/todos_test/children/:todo_id', TodoCtroller.test2);

app.use(function (request, response) {
    response.status(404).json({
        message: 'Oops! You may get lost!',
        code: 'E_NOTFOUND'
    });
});

app.use(function (error, request, response, next) {
    response.status(500).json({
        message: error.message,
        code: error.code
    });
});
module.exports = app;