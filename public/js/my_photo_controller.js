var app = angular.module('my_photo_App', ['naif.base64']);
app.controller('my_photo_controller', function($scope,$http) {

  $scope.id_user = undefined;
  $scope.photo = undefined;

  $scope.updatePhoto = function () {
    /*TODO: convertir a base64 el archivo que recibo*/
    console.log("/users/"+$scope.id_user+"/photo");
    $http({
      url: "/users/"+$scope.id_user+"/photo",
      method: "PUT",
      headers:{
        'Content-Type': 'application/json'
      },
      data: { "photo" : $scope.photo.base64 }
    }).then(function(response) {
      console.log(response.data);
    },
    function(response) {
      console.error(response);
    });
  };

});
