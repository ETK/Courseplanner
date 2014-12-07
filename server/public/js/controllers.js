var appControllers = angular.module('appControllers', []);

var toLevelKey ={
    "100":100,
    "100/A":100,
    "200":200,
    "200/B":200,
    "300":300,
    "300/C":300,
    "400":400,
    "400/D":400
  }


appControllers.controller('fundmentalCourses', ['$scope', '$http', function($scope, $http) {
  	 $http.get("/api/program/ASSPE1689/fundcourses/areanames").success(function(areanames){
          $scope.areas = areanames;

     })
     
     $scope.levels = [];
     $scope.courses =[];
     $scope.selectedLevel ="";
     $scope.selectedArea ="";
    
  

     $scope.getLevels = function(area){
     
       
        $http.get("/api/program/ASSPE1689/fundcourses/areanames/"+area+"/levels").success(function(levels) {
          $scope.levels = levels
        });
        $scope.selectedArea = area;
     }

     $scope.getCourses = function(level){
      if ($scope.selectedArea=="") return;
      if (toLevelKey[level]==undefined )return;
    

      $scope.course_set= [];
       
      $http.get("/api/program/ASSPE1689/fundcourses/areanames/"+$scope.selectedArea+"/levels/"+toLevelKey[level]+"/courses").success(function(courses) {
        _.each(_.range(courses.length),function(i){
            if ($scope.course_set[(i/4)|0] ==null){
              $scope.course_set[(i/4)|0]  = [];
            }
            $scope.course_set[(i/4)|0].push(courses[i]);
        });
      });
          
     
     }

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