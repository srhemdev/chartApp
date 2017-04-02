'use strict';
/**
 * myApp module
 */
angular.module('myApp', [
  'ngRoute',
  'myApp.chartView'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  //Default Route
  $routeProvider.otherwise({redirectTo: '/charts'});
}]);
