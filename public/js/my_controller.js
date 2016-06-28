
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {

  $scope.lista_usuarios = [];
  $scope.lista_intereses = [];
  $scope.lista_categorias = [];
  $scope.id_user = undefined;
  $scope.showMe_success = false;
  $scope.showMe_error = false;
  $scope.interest = { "category" : undefined, "value" : undefined, active : undefined};
  $scope.photo = undefined;
  $scope.user = {};
  $scope.sex = ["male","female"];

  $scope.getCategories = function () {
    $http.get("/categories").then(function(response) {
      console.log(response.data);
      $scope.lista_categorias = response.data.categories;
    });
  };

  $scope.getUsers = function () {
    $http.get("/users").then(function(response) {
      console.log(response.data);
      $scope.lista_usuarios = response.data.users;
    });
  };

  $scope.getUser = function () {
    $http.get("/users/"+$scope.id_user).then(function(response) {
        console.log(response.data);
        $scope.showMe_success = true;
        $scope.showMe_error = false;
        $scope.user = [response.data.user];
        var user_photo = Base64.decode($scope.user.photo_profile);
        $scope.user.photo_profile = user_photo;
    },function(response) {
        console.error(response);
        $scope.showMe_error = true;
        $scope.showMe_success = false;
    });
  };

  $scope.getInterests = function () {
    $http.get("/interests").then(function(response) {
      console.log(response.data);
      $scope.lista_intereses = response.data.interests;
    });
  };

  $scope.restartShowMe = function () {
    $scope.showMe_error = false;
    $scope.showMe_success = false;
  };

  $scope.deleteUser = function () {
    $scope.restartShowMe();
    $http.delete("/users/"+$scope.id_user).then(function(response) {
      console.log(response.data);
      $scope.showMe_success = true;
      $scope.showMe_error = false;
    },function(response) {
      console.error(response);
      $scope.showMe_error = true;
      $scope.showMe_success = false;
    });
  };

  $scope.saveInterests = function () {
    for(var i in $scope.lista_intereses) {
      if($scope.lista_intereses[i].active) {
        $scope.user.interests.push({'category':$scope.lista_intereses[i].category,'value':$scope.lista_intereses[i].value});
      }
    }
  };

  $scope.addUser = function () {
    $scope.saveInterests();
    $http({
      url: '/users',
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { 'user' : $scope.user }
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
    });
  };

  $scope.init_addUser = function () {
    $scope.user.interests = [];
    var one_interest;
    $http.get("/interests").then(function(response) {
      console.log(response.data);
      for(var i in response.data.interests){
        one_interest = {category: response.data.interests[i].category, value: response.data.interests[i].value, active: false};
        $scope.lista_intereses.push(one_interest);
      }
    });
  };

  $scope.addInterest = function() {
    $http({
      url: '/interests',
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { "interest" : $scope.interest}
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
    });
  };

  $scope.updateUser = function () {
    $scope.saveInterests();
    $http({
      url: '/users/'+$scope.user.id,
      method: "PUT",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { "user" : $scope.user}
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
    });
  };


});
