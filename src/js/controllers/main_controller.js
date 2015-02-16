angular.module('K2020.controllers.Main', ['ngSanitize', 'ngCookies', 'ipCookie', 'ngLocalize','ngLocalize.Events'])

.controller('MainController', ['$scope', '$http', '$location', '$route', '$rootScope', '$cookies', 'ipCookie', '$filter', 'localeEvents', 'locale', '$analytics', function($scope, $http, $location, $route, $rootScope, $cookies, ipCookie, $filter, localeEvents, locale, $analytics) {
  //'use strict';

  // language
  $scope.languages = {
    'de':"Deutsch",
    'en':"English",
    'tr':"Türkçe"
  }

  // init language
  $scope.lang = "de"

  // localization
  $scope.$watch('lang', function(l) {
  });

  $scope.setLocale = function (loc) {
    locale.setLocale(loc);
    $scope.lang = loc;
    $scope.t={}
    for (var tra in $scope.translations) {
      $scope.t[tra] = $filter('htmlStripOuterTag')($scope.translations[tra][$scope.lang])
    }
    console.log($scope.t)
  };

  $scope.$on(localeEvents.localeChanges, function (event, data) {
    console.log('new locale chosen: ' + data);
  });  


  // load game data
  $http.get("yaml/game.yaml").success(function (data) {
    console.log("YAML loaded (" + data.length + " characters)")
    var game = jsyaml.load(data)
    add_indexes(game)
    translate_markdown_nodes(game)
    $scope.game = game.game
    $scope.translations = game.translations
    console.log($scope.game)
    // init view
    $scope.activeTask = $scope.game.challenges[0].tasks[0]
    // init game
    gameLoad() || gameReset()
    // redirect to dashboard if game is running and to intro if not
    if ($scope.gameState.gameStarted){  
      $location.path('/');
      $scope.setLocale($scope.gameState.language)
      console.log("redirect to dashboard, continue game")
    }
    else {
      $location.path('/intro');
      $scope.setLocale($scope.gameState.language)
      gameReset()
      $scope.activeTask = $scope.game.introtask
      console.log("redirect to intro")
    }
  }).error(function() {
    alert("Game data not available")
  })

  // game state
  gameReset = function() {
    $scope.gameState = {
      language: "de",
      introtaskSolved: false,
      challengeIndex: 0,
      taskIndex: 0,
      gameStarted: false,
      gameFinished: false
    }
    gameSave()
    console.log("game reset")
  }
  gameStart = function() {
    $scope.gameState.language = $scope.lang
    $scope.gameState.gameStarted = true
    gameSave()
    console.log("game start")
    $analytics.eventTrack('gameStart');
  }
  gameAdvance = function() {
    nextTaskIndexInChallenge =  $scope.game.challenges[$scope.gameState.challengeIndex].tasks[$scope.gameState.taskIndex+1]
    nextChallengeIndex       =  $scope.game.challenges[$scope.gameState.challengeIndex+1]
    if (nextTaskIndexInChallenge != undefined) {
      $scope.gameState.taskIndex++
      $analytics.eventTrack('gameAdvance', {  challenge: $scope.gameState.challengeIndex, task: $scope.gameState.taskIndex });
    }
    else if (nextChallengeIndex != undefined) { // assuming every challenge has tasks
      $scope.gameState.challengeIndex++
      $scope.gameState.taskIndex = 0
      $analytics.eventTrack('gameAdvance', {  challenge: $scope.gameState.challengeIndex, task: $scope.gameState.taskIndex });
    }
    else {
      $scope.gameState.gameFinished = true
      $analytics.eventTrack('gameFinished');
    }
    console.log($scope.gameState)
    // ...and save
    gameSave()
  }
  gameGetStartMessage = function() {
    return $scope.game.text.pre[lang]
  }

  gameCheckForm = function() {
    /*
    if ($scope.conditionForm != undefined)
      if ($scope.conditionForm.$valid) gameAdvance()
    */
  }

  challengeSolved = function(challenge) {
    return $scope.gameState.challengeIndex > challenge.index || $scope.gameState.gameFinished
  }

  challengeCurrent = function(challenge) {
    return $scope.gameState.challengeIndex == challenge.index && !$scope.gameState.gameFinished
  }

  challengeAvailable = function(challenge) {
    return challengeSolved(challenge) || challengeCurrent(challenge)
  }  

  taskSolved = function(task) {
    introTaskSolved = ( $scope.gameState.gameStarted == false && $scope.gameState.introtaskSolved || task == $scope.game.introtask && $scope.gameState.gameStarted)
    regularTaskSolved = ( $scope.gameState.challengeIndex > task.challengeIndex  || $scope.gameState.challengeIndex == task.challengeIndex  && $scope.gameState.taskIndex > task.index  || $scope.gameState.gameFinished)
    return (regularTaskSolved || introTaskSolved)
  }

  taskCurrent = function(task) {
    return $scope.gameState.challengeIndex == task.challengeIndex && $scope.gameState.taskIndex == task.index && !$scope.gameState.gameFinished
  }

  taskAvailable = function(task) {
    return taskSolved(task) || taskCurrent(task)
  }

  gameGetCurrentTask = function() {
    if ($scope.gameState != undefined && $scope.gameState.gameStarted && !$scope.gameState.gameFinished) {
      //console.log($scope.game.challenges[$scope.gameState.challengeIndex].tasks[$scope.gameState.taskIndex])
      return $scope.game.challenges[$scope.gameState.challengeIndex].tasks[$scope.gameState.taskIndex]
    }
    else return false
  }

  gameIsAtBeginning = function() {
    return $scope.gameState.gameStarted && $scope.gameState.challengeIndex == 0 && $scope.gameState.taskIndex == 0
  }

  gameIsFinished = function() {
    return $scope.gameState.gameFinished
  }

  taskConditionGetTemplateName = function(task) {
    for (var prop in task.condition) {
      break;
    }
    console.log(prop)
    return prop
  }

  setSlideDirection = function(dir) {
    console.log("set slide direction "+dir)
    $scope.slideDirection = dir
  }

  $scope.gameAdvance = gameAdvance
  $scope.gameReset = gameReset
  $scope.gameStart = gameStart
  $scope.taskSolved = taskSolved
  $scope.taskCurrent = taskCurrent
  $scope.taskAvailable = taskAvailable
  $scope.challengeAvailable = challengeAvailable
  $scope.gameGetCurrentTask = gameGetCurrentTask
  $scope.taskConditionGetTemplateName = taskConditionGetTemplateName
  $scope.gameCheckForm = gameCheckForm
  $scope.gameGetStartMessage = gameGetStartMessage
  $scope.gameIsAtBeginning = gameIsAtBeginning
  $scope.gameIsFinished = gameIsFinished
  $scope.setSlideDirection = setSlideDirection

  gameSave = function() {
    //saveString = angular.toJson($scope.gameState, false);
    //$cookies.K2020game = saveString
    ipCookie("K2020game", $scope.gameState, { expires: 2, expirationUnit: 'hours' })
    console.log("game saved")
  }

  gameLoad = function() {
    saveString = ipCookie("K2020game")
    console.log(saveString)
    //saveString = $cookies.K2020game;
    //console.log(saveString)
    if (saveString != undefined) {
      $scope.gameState = saveString
      console.log("game loaded")
      console.log($scope.gameState)
      return true
    }
    else return false
  }

  // regexp for condition
  regexForCondition = function(t) {
    var conditionType = $scope.taskConditionGetTemplateName(t)
    var condition = $scope.activeTask.condition[conditionType]
    switch(conditionType) {
      case "text input":
        r = RegExp("^"+(condition.correct).join('|')+'$', 'i')
        break;
      default:
        r = RegExp("")
    }
    return r
  }

  // location service for tasks
  $scope.goTask = function ( t ) {
    $scope.activeTask = t
    $location.path( "/task" )
    $scope.slideDirection = "inside"
    // find correct answer(s)
    $scope.conditionValue = ""
    $scope.regexForCondition = regexForCondition(t)
  }

  $scope.location  = $location

  //current template
  $rootScope.$on('$routeChangeSuccess', function(){ 
     $scope.template = $route['current']['name']
     $scope.show_nav = $route['current']['nav']
     console.log($route['current']['name'])
    switch($route['current']['name']) {
      case "home":
        $scope.nav_text = $scope.t.dashboard
        break;
      //case "task":
      //  $scope.nav_text =  $filter('htmlToPlaintext')($scope.activeTask.text.title[$scope.lang])
      //  break;
      case "intro":
        $scope.activeTask = $scope.game.introtask
        break;
      default:
        $scope.nav_text = $scope.t.systemName
      }
  });

  //slide scroll direction
  $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
     //slideDistance = (prevRoute == undefined) ? 0 : currRoute.depth - prevRoute.depth
     //$scope.slideDirection = slideDistance > 0 ? "inside" : slideDistance == 0 ? "same" : "outside"
     //console.log($scope.slideDirection)
  });

  html = {
    chevron_right: '<i class="fa fa-chevron-right pull-right"></i>',
    check_task_solved: function(task) {if (taskSolved(task)) return '<i class="fa fa-check"></i>'},
    check_challenge_solved: function(challenge) {if (challengeSolved(challenge)) return '<i class="fa fa-check"></i>'},
  }

  $scope.html = html

  $scope.forms = {};
  $scope.$watch('forms.condition', function(form) {
    if(form) {
      var fform = form
      $scope.$watch('forms.condition.$valid', function(valid) {
        if(fform.$valid && !fform.$pristine) {
          console.log("task solved (detected)")
          if ($scope.gameState.gameStarted) {
            gameAdvance()
            
          }
          else {
            $scope.gameState.introtaskSolved = true
          }
          scrollTaskSolved()
          form.$setPristine()
          form.$setValidity(false)            
        }
      });
    }
  });

  scrollTaskSolved = function() {
    var elem = angular.element(document.querySelector('.scrollable-content'));
    var scrollableContentController = elem.controller('scrollableContent');
    // - Scroll to top of containedElement
    var containedElement = angular.element(document.getElementById('condition-solved'));
    scrollableContentController.scrollTo(containedElement);
    window.setTimeout( function() {document.getElementById('scrollable').scrollTop+=100}, 50);
  }

  $scope.scrollTaskSolved = scrollTaskSolved

}]);
