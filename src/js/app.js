var app = angular.module('K2020', [
  'ngRoute',
  'mobile-angular-ui',
  'K2020.controllers.Main',
  /*'ConditionsController',*/
  'ngSanitize',
  'ngAnimate',
  'filters',
  'ngLocalize',
  'ngLocalize.Events',
  'ngLocalize.InstalledLanguages',
  /*'valBubble',
  'chatStyle'*/
]).value('localeConf', {
    basePath: 'languages',
    defaultLocale: 'de-DE',
    sharedDictionary: 'common',
    fileExtension: '.lang.json',
    persistSelection: false,
    cookieName: 'COOKIE_LOCALE_LANG',
    observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
    delimiter: '::'
}).value('localeSupported', [
    'en-US',
    'de-DE',
    'tr-TR'
]).value('localeFallbacks', {
    'en': 'en-US',
    'de': 'de-DE',
    'tr': 'tr-TR'
})

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false, depth: 1}); // Arbeitsmappe
  $routeProvider.when('/task', {templateUrl: 'task.html', reloadOnSearch: false, depth: 2}); // Task
  $routeProvider.when('/about', {templateUrl: 'about.html', reloadOnSearch: false, depth: 2}); // About
  $routeProvider.when('/start', {templateUrl: 'start.html', reloadOnSearch: false, depth: 0}); // Start message
  $routeProvider.when('/intro', {templateUrl: 'intro.html', reloadOnSearch: false, depth: 0}); // First page
});

/*
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
*/

angular.module('filters', [])
  .filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  })
  /*
  .filter('htmlForTimedOutput', function() {
    return function(text) {
      return String(text).replace(/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/gm, '');
    }
  })
  */