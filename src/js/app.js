var app = angular.module('K2020', [
  'ngRoute',
  'mobile-angular-ui',
  'K2020.controllers.Main',
  'ngSanitize',
  'ngAnimate'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false, depth: 2});
  $routeProvider.when('/task', {templateUrl: 'task.html', reloadOnSearch: false, depth: 1}); 
  $routeProvider.when('/about', {templateUrl: 'about.html', reloadOnSearch: false, depth: 1}); 
});

app.run(function($rootScope, $window) {
  // publish current transition direction on rootScope
  $rootScope.direction = 'ltr';
  // listen change start events
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    $rootScope.direction = 'rtl';
    console.log(arguments);
    if (current && next && (current.depth > next.depth)) {
      $rootScope.direction = 'ltr';  
    }
    // back
    $rootScope.back = function() {
      $window.history.back();
    }});
  });
