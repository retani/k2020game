angular.module('K2020', [
  'ngRoute',
  'mobile-angular-ui',
  'K2020.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
});