var app = angular.module('K2020', [
  'ngRoute',
  'mobile-angular-ui',
  'K2020.controllers.Main',
  /*'ConditionsController',*/
  'ngSanitize',
  'ngAnimate',
  'ipCookie',
  'filters',
  'ngLocalize',
  'ngLocalize.Events',
  'ngLocalize.InstalledLanguages',
  'angulartics', 
  'angulartics.google.analytics'
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
  $routeProvider.when('/', {name: "home", templateUrl:'home.html',  reloadOnSearch: false, depth: 1, nav: true}); // Arbeitsmappe
  $routeProvider.when('/task', {name: "task", templateUrl: 'task.html', reloadOnSearch: false, depth: 2, nav: true}); // Task
  $routeProvider.when('/about', {name: "about", templateUrl: 'about.html', reloadOnSearch: false, depth: 2, nav: false}); // About
  $routeProvider.when('/start', {name: "start", templateUrl: 'start.html', reloadOnSearch: false, depth: 0, nav: true}); // Start message
  $routeProvider.when('/intro', {name: "intro", templateUrl: 'intro.html', reloadOnSearch: false, depth: 0, nav: false}); // First page
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
  .filter('htmlStripOuterTag', function() {
    return function(text) {
      if (text == undefined) return ""
      else return String(text).replace(/^<[^>]+>/gm, '').replace(/<[^>]+>$/gm, '');
    }
  })
  .filter('htmlBlockquotesToBubbles', function() {
    return function(text) {
      return String(text).replace(/<blockquote>/gm,
       '<div class="bubble left"><span class="tail">&nbsp;</span><blockquote>')
      .replace(/<\/blockquote>/gm,
       '</blockquote></div>');
    }
  })    
  /*
  .filter('htmlForTimedOutput', function() {
    return function(text) {
      return String(text).replace(/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/gm, '');
    }
  })
  */


/*
angular.element(document).ready(function() {

  var myApplication = angular.module("K2020", []);

  fetchData().then(bootstrapApplication);

  function fetchData() {
      var initInjector = angular.injector(["ng"]);
      var $http = initInjector.get("$http");

      return $http.get("yaml/game.yaml").then(function(response) {
          myApplication.constant("yaml", response.data);
      }, function(errorResponse) {
          // Handle error case
      });
  }

  function bootstrapApplication() {
    angular.bootstrap(document.body, ["K2020"]);
  }
  
});
*/

angular.element(document).ready(
  function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('yaml/game.yaml').then(
      function(response) {
        console.log("YAML loaded (" + response.data.length + " characters)")
        app.constant('gameYaml', response.data);
        angular.bootstrap(document.body, ['K2020']);
      }
    );
  }
);


