var appControllers = angular.module('appControllers', []);

appControllers.controller('fundmentalCourses', ['$scope', '$http', function($scope, $http) {
  $http.get('/js/data.json').success(function(data) {
    console.log(data);
  });
}]);


// authorControllers.controller('detailController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
//   $http.get('js/data.json').success(function(data) {
//     $scope.author = data;
//     $scope.whichItem = $routeParams.itemId;

//     if($routeParams.itemId > 0)
//     {
//     	$scope.prevItem = Number($routeParams.itemId) - 1;
//     }else{
//     	$scope.prevItem = $scope.author.length - 1;
//     }

//     if($routeParams.itemId < $scope.author.length - 1)
//     {
//     	$scope.nextItem = Number($routeParams.itemId) + 1;
//     }else{
//     	$scope.nextItem = 0;
//     }

//   });
// }]);