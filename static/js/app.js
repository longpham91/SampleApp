angular.module('Todo', [])
    .factory('Todo', function ($http) {

        var todoListFactory = function (rawTodoListData) {
            var todos = [];
            angular.forEach(rawTodoListData, function (rawTodoData) {
                todos.push(new Todo(rawTodoData).$$setId(rawTodoData.id))
            });
            return todos;
        };

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
            return $http.post('/api/v1/todos', this.toJson()).then(function (response) {
                return new Todo(response.data).$$setId(response.data.id);
            })
        };

        Todo.prototype.delete = function () {
            return $http.delete('/api/v1/todos/' + this.id);
        };

        Todo.prototype.toJson = function () {
            return {
                text: this.text || null,
                complete: this.complete || null
            }
        };

        Todo.all = function () {
            return $http.get('/api/v1/todos').then(function (response) {
                return todoListFactory(response.data);
            })
        };

        return (Todo)
    })

    .controller('todoCtrl', function ($scope, Todo) {
        $scope.processing = true;
        $scope.todos = [];

        Todo.all().then(function (todos) {
            $scope.todos = todos
        }).finally(function () {
            $scope.processing = false;
        })
        ;

        $scope.addNewTodo = function () {
            $scope.processing = true;
            var todo = new Todo({text: $scope.newTodoText, complete: false});

            todo.save().then(function (todo) {
                $scope.todos.push(todo);
                $scope.newTodoText = '';
            }).finally(function () {
                $scope.processing = false;
            })
            ;
        };

        $scope.save = function (todo) {
            $scope.processing = true;
            todo.save().finally(function () {
                $scope.processing = false;
            });
        };

        $scope.countCompleted = function () {
            var completed = 0;
            angular.forEach($scope.todos, function (todo) {
                if (todo.complete) {
                    completed++;
                }
            });
            return completed;
        };

        $scope.clearCompleted = function () {
            angular.forEach($scope.todos, function (todo, index) {
                if (todo.complete) {
                    todo.delete().then(function () {
                       $scope.todos.splice(index, 1)
                    });
                }
            });
        }
    })
;