angular.module('Todo', [])
    .factory('Todo', function ($http) {
        var Todo = function (raw) {
            this.$$massAssign(raw);
        };

        Todo.prototype.$$massAssign = function (raw) {
            this.text       = raw.text;
            this.complete   = raw.complete;
            return this;
        };

        Todo.prototype.$$setId = function (id) {
            this.id = id;
            return this;
        };

        Todo.prototype.save = function () {
            var self = this;
            // Have id, perform update
            if (this.id) {
                return $http.put('/api/v1/todos/' + this.id, this.toJson()).then(function (response) {
                    return self.$$massAssign(response.data);
                });
            }

            // Otherwise perform add
            return $http.post('/api/v1/todos', this.toJson).then(function (response) {
                return self.$$setId(response.data.id).$$massAssign(response.data);
            })
        };

        Todo.prototype.delete = function () {
            var self = this;
            return $http.delete('/api/v1/todos/' + this.id).then(function (response) {
                return self.$$massAssign(response.data);
            });
        };

        Todo.prototype.toJson = function () {
            return {
                text: this.text || null,
                complete: this.complete || null
            }
        };

        Todo.all = function () {
            return $http.get('/api/v1/todos').then(function (response) {
                var todos = [];
                angular.forEach(response.data, function (rawTodoData) {
                    todos.push(new Todo(rawTodoData).$$setId(rawTodoData.id))
                });
                return todos;
            })
        };

        return (Todo)
    })

    .controller('todoCtrl', function ($scope, Todo) {

        $scope.todos = [];

        Todo.all().then(function (todos) {
            $scope.todos = todos
        });

        $scope.addNewTodo = function () {
            var todo = new Todo({text: $scope.newTodoText, complete: false});

            todo.save().then(function (todo) {
                $scope.todos.push(todo);
                $scope.newTodoText = '';
            })
        }
    })
;