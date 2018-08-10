app = angular.module('app',[]);

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
  $http.get('http://localhost:3000/product').then((result) => {
    console.log('result from http');
    console.log(result.data);
    $scope.products = result.data.products;
  }, (err) => {
    console.log('error in http');
    console.log(err);
  });
}]);
