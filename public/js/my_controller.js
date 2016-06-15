
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {

  $scope.lista_usuarios = [];
  $scope.showMe = false;

  $scope.getUsers = function () {
    $http.get("/users").then(function(response) {
      console.log(response.data);
      $scope.lista_usuarios = response.data.users;
    });
  };


});
