var tedious = require('tedious');
var config  = require('./config/tedious-connection');
var ConnectionPool = require('tedious-connection-pool');

module.exports = function (request, response, next) {
    var connection = new tedious.Connection(config);
    
    connection.on('connect', function (error) {
        if (error) {
            next(error);
        } else {
            request.app.set('db', connection);
            request.app.set('tedious', tedious);
            next();
        }
    })
};