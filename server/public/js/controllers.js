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
          
          $scope.levels = _.map(levels, function(level){return toLevelKey[level]})
        });
        $scope.selectedArea = area;
     }

     $scope.getCourses = function(level){
      if ($scope.selectedArea=="") return;
      if (toLevelKey[level]==undefined )return;
    

      $scope.course_set= [];
      $scope.courses =[];
      $http.get("/api/program/ASSPE1689/fundcourses/areanames/"+$scope.selectedArea+"/levels/"+level+"/courses").success(function(courses) {
        
        $scope.courses = courses;

        //normalize level string to standard level numbers
        for (var i=0;i<courses.length;i++){
          courses[i].Level = toLevelKey[courses[i].Level];

        }

        _.each(_.range(courses.length),function(i){
            if ($scope.course_set[(i/4)|0] ==null){
              $scope.course_set[(i/4)|0]  = [];
            }
            $scope.course_set[(i/4)|0].push(courses[i]);
        });
      });

     }
    $scope.selected = Array()
     $scope.clickedCourse = function(course){
        course.selected =true;

     }
     $scope.isSelected = function(course){
        console.log((course.selected==undefined)?false : course.selected);
        return (course.selected==undefined)?false : course.selected;

     }
     $scope.removeCourse= function(course){
       /* for(var i =0;i<$scope.selected.length;i++){
              if (course== $scope.selected[i])
                $scope.selected.splice(i,1);
        }
        console.log($scope.selected)*/
        course.selected =false;
     }

}]);


appControllers.controller('AdvancedCourses', ['$scope', '$http', function($scope, $http) {
     

   $http.get("/api/program/ASSPE1689/areacourses/areanames").success(function(data){
        $scope.areas = data;
    }).error(function() {
       alert("error text message (http get area courses)");
    });
     
     $scope.levels = [];
     $scope.courses =[];
     $scope.selectedLevel ="";
     $scope.selectedArea ="";
     
     $scope.getCourses = function(area){  
        $scope.course_set= []; 

        $http.get("/api/program/ASSPE1689/areacourses/areanames/"+area+"/courses").success(function(courses) {
          //console.log("courses length: " + courses.length) 
          _.each(_.range(courses.length),function(i){
          if ($scope.course_set[(i/4)|0] ==null){
            //console.log("courses number: " + i + "courses name " + courses[i]) 
            $scope.course_set[(i/4)|0]  = [];
          }
          //console.log("COURSE OUTSIDE THE LOOP courses number: " + i + "courses name " + courses[i])
          $scope.course_set[(i/4)|0].push(courses[i]); 
        
        });

        }).error(function() {
          alert("error text message (http get area courses)");
        });
        console.log("end result " + $scope.course_set)
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