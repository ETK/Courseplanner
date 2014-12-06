var appControllers = angular.module('appControllers', []);

appControllers.controller('fundmentalCourses', ['$scope', '$http', function($scope, $http) {
  	 $scope.areas = _.uniq(data,function(course){
        return course["course_code"].substr(0,3);
     }).map(function(course){return course["course_code"].substr(0,3)});

     
     $scope.levels = [];
     $scope.courses =[];
     $scope.selectedLevel ="";
     $scope.selectedArea ="";
    
  

     $scope.getLevels = function(area){
      //console.log(area);
        var url = 'http://localhost:8080/api/areas';// URL where the Node.js server is running  
        $http.get(url).success(function(data) {
         console.log(data);
        });
   
      $scope.levels = _.uniq(data.filter(function(course){
          return course["course_code"].substr(0,3) == area;
      }),function(course){return course["Level"]})
      .map(function(course){return course["Level"]});
      $scope.selectedArea = area;
     }

     $scope.getCourses = function(level){
      if ($scope.selectedArea=="") return;

     var courses = data.filter(function(course){
          return (course["course_code"].substr(0,3) ==$scope.selectedArea)&& (course["Level"]==level);
      });

       $scope.course_set= [];
      //console.log(courses.length);
      _.each(_.range(courses.length),function(i){
          if ($scope.course_set[(i/4)|0] ==null){
            $scope.course_set[(i/4)|0]  = [];
          }
          $scope.course_set[(i/4)|0].push(courses[i]);
      });
      //console.log($scope.course_set);
     }

     //console.log($scope.areas);
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