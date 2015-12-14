var tedious = require('tedious');

exports.post = function (req, res) {
    var request = new tedious.Request("INSERT INTO dbo.items(text, complete) VALUES (@text, @complete)", function (err) {
        if (err) {
            return res.status(500).json({success: false, data: err});
        }
    });
    request.addParameter('text', tedious.TYPES.NVarChar, req.body.text);
    request.addParameter('complete', tedious.TYPES.Bit, false);

    request.on('doneInProc', function () {
        res.json({text: req.body.text, complete: false});
    });

    req.app.get('db').execSql(request);
};

// MSSQL
exports.get = function (req, res) {

    var query = new tedious.Request("SELECT * FROM items ORDER BY id ASC", function (error) {
        if (error) {
            return res.status(500).json({success: false, data: err});
        }
    });
    var listTodo = [];
    query.on('row', function(columns) {
        listTodo.push({
            id: columns.id.value,
            text: columns.text.value,
            complete: columns.complete.value
        });
    });

    query.on('doneInProc', function () {
       res.json(listTodo);
    });
    req.app.get('db').execSql(query);
};

// todo migrates to mssql
exports.put = function (req, res) {

    var request = new tedious.Request("UPDATE items SET text=@text, complete=@complete WHERE id=@id", function (err) {
        if (err) {
            return res.status(500).json({success: false, data: err});
        }
    });
    request.addParameter('id', tedious.TYPES.Int, req.params.todo_id);
    request.addParameter('text', tedious.TYPES.NVarChar, req.body.text);
    request.addParameter('complete', tedious.TYPES.Bit, req.body.complete);
    request.on('doneInProc', function () {
        res.json(req.body);
    });

    req.app.get('db').execSql(request);

};

// todo migrates to mssql
exports.delete = function (req, res) {

    var deleteQuery = new tedious.Request('DELETE FROM items where id=(@itemId)', function (error) {
        if (error) {
            return res.status(500).json({success: false, data: err});
        }
    });
    deleteQuery.addParameter('itemId', tedious.TYPES.Int, req.params.todo_id);

    req.app.get('db').execSql(deleteQuery);
    deleteQuery.on('doneInProc', function () {
        res.json({status: 'ok'});
    })
};