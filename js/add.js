var app = angular.module('AddPage', []);

app.controller('AddCtrl', function($scope, $http) {

    // Load task list from backend
    $scope.list = [];   
    $scope.loadTasks = function () {
        $http.get('http://localhost:3000/tasks')
          .then(function (response) {
            console.log("✅ Fetched tasks:", response.data);
            $scope.list = response.data;
          }, function (error) {
            console.error("❌ Error fetching tasks:", error);
          });
    };
    
    $scope.loadTasks(); // Load tasks when page loads

    // Add a new task
    $scope.AddTask = function(task, price, category, description) {
        const taskData = {
            task: task,
            price: price,
            category: category,
            description: description
        };
        
        
          
        $http.post('http://localhost:3000/addTask', taskData)
            .then(function(response) {
                console.log(response.data.message);

                // Reload the task list after adding
                $scope.loadTasks();

                // Clear form
                $scope.task = '';
                $scope.price = '';
                $scope.category = '';
                $scope.description = '';
            }, function(error) {
                console.error('Error saving task:', error);
            });

            window.location.href = "home.html"
    };

    
    $scope.deleteTask = function (id) {
        $http.delete('http://localhost:3000/deleteTask/' + id)
          .then(function (response) {
            console.log(response.data.message);
            $scope.loadTasks(); // Refresh list after deletion
          }, function (error) {
            console.error('Error deleting task:', error);
          });
      };
      
      $scope.completeTask = function (id) {
        $http.put('http://localhost:3000/completeTask/' + id)
          .then(function (response) {
            console.log(response.data.message);
            $scope.loadTasks(); // Refresh list after update
          }, function (error) {
            console.error('Error marking task complete:', error);
          });
      };
});
