angular.module('K2020', [
  'ngRoute',
  'mobile-angular-ui',
  'K2020.controllers.Main',
  'ngSanitize'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
  $routeProvider.when('/task', {templateUrl: 'task.html', reloadOnSearch: false}); 
  $routeProvider.when('/about', {templateUrl: 'about.html', reloadOnSearch: false}); 
});