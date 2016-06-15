
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {

  $scope.user = {}
  $scope.lista_usuarios = [];
  $scope.lista_intereses = [];
  $scope.id_user = null;
  $scope.showMe = false;

  $scope.getUsers = function () {
    $http.get("/users").then(function(response) {
      console.log(response.data);
      $scope.lista_usuarios = response.data.users;
    });
  };

  $scope.getUser = function () {
    $http.get("/users/"+$scope.id_user).then(function(response) {
      console.log(response.data);
      $scope.showMe = true;
      $scope.user = [response.data.user];
    });
  };

  $scope.getInterests = function () {
    $http.get("/interests").then(function(response) {
      console.log(response.data);
      $scope.lista_intereses = response.data.interests;
    });
  };

  $scope.deleteUser = function () {
    $http.delete("/users/"+$scope.id_user).then(function(response) {
      console.log(response.data);
    });
  };


});
