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


//Creates Courses Collection and associated methods
//all courses data uses this sington to perform data access and binding
appControllers.factory('Courses',function($http){
    return {
      //singleton courses collection
      data : [],
      //method to query the courses collection by area and level
      queryCourses: function(area, level,success){
        $http.get("/api/program/ASSPE1689/fundcourses/areanames/"+area+"/levels/"+level+"/courses").success(function(courses) {
            //assign recieved courses to singleton courses collection
            //this will cause anything that binds to reference to update
            data = courses;
            if (success!=null)
              success(courses);
        });

      },
    }


});


appControllers.controller('fundmentalCourses', ['$scope', '$http', 'Courses', function($scope, $http,Courses) {
  	 
    
     $scope.levels = [];
     $scope.courses =[];
     $scope.selectedLevel ="";
     $scope.selectedArea ="";
  

      $scope.course_set= [];

      //bind Courses.data collection to UI variable
      $scope.courses = Courses.data;

      $http.get("/api/program/ASSPE1689/fundcourses/areanames").success(function(areanames){
          $scope.areas = areanames;
     });

     $scope.getLevels = function(area){   
        $http.get("/api/program/ASSPE1689/fundcourses/areanames/"+area+"/levels").success(function(levels) {
          
          $scope.levels = _.map(levels, function(level){return toLevelKey[level]})
        });
        $scope.selectedArea = area;
     }

     $scope.getCourses = function(level){
        if ($scope.selectedArea=="") return;
        if (toLevelKey[level]==undefined )return;
      
        //perform course query, and on success, parse each course object and divide courses into rows
        Courses.queryCourses($scope.selectedArea,level, function(courses){
          $scope.course_set= [];
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
   

      //when selected, the course.selected property is set to true
      //in the view, ng-class="{selected:isSelected(course)}" is added to the course block
      //dom element
      //this binds the existence of "selected" class to the whether isSelected(course) evaluates
      //true or false. 
     $scope.clickedCourse = function(course){
        course.selected =true;
     }

      //this evaluates whether a course is being selected and returns true if so.
      //when this returns true, "selected" class is added to course block dom,
      //when this returns false, "selected" class is removed.
      //this is listening to course.selected, i.e. if course.selected is changed, 
      //the function is re-evaluated to reflect the change
     $scope.isSelected = function(course){
        return (course.selected==undefined)?false : course.selected;
     }

     //set the course to not being selected
     $scope.removeCourse= function(course){
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
        //console.log("end result " + $scope.course_set)
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