var myApp = angular.module('myApp', [
	'ngRoute',
	'appControllers'
]);

myApp.config(['$routeProvider', function($routeProvider){
	//$routeProvider.
//	when('/li', {
//		templateUrl: 'partial/list.html',
//		controller: 'listController'
//	}).
	// when('/detail/:itemId', { 
	// 	templateUrl: 'partial/detail.html',
	// 	controller: 'detailController'
	// }).
//	otherwise({
//		redirectTo:'/list'
//	});
}]);

