
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {

  $scope.lista_usuarios = [];
  $scope.lista_intereses = [];
  $scope.lista_categorias = [];
  $scope.id_user = undefined;
  $scope.showMe = false;
  $scope.interest = { "category" : undefined, "value" : undefined }
  $scope.photo = undefined;
  $scope.user = {}
  $scope.sex = ["Hombre","Mujer"];

  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

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

  $scope.updatePhoto = function () {
    /*TODO: convertir a base64 el archivo que recibo*/
    var photo_texted = Base64.encode($scope.photo);
    $http({
      url: '/users/'+scope.id_user+'/photo',
      method: "PUT",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { "photo" : photo_texted}
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
    });
  };

  $scope.addUser = function () {
    $http({
      url: '/users',
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { 'user' : $scope.user}
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
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
