angular.module('K2020.controllers.Main', ['ngSanitize', 'ngCookies','ngLocalize','ngLocalize.Events'])

.controller('MainController', ['$scope', '$http', '$location', '$route', '$rootScope', '$cookies','localeEvents', 'locale', function($scope, $http, $location, $route, $rootScope, $cookies, localeEvents, locale) {
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
    console.log("change!!"+l)
  });

  $scope.setLocale = function (loc) {
    locale.setLocale(loc);
    $scope.lang = loc;
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
      console.log("redirect to intro")
    }
  }).error(function() {
    alert("Game data not available")
  })

  // game state
  gameReset = function() {
    $scope.gameState = {
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
  }
  gameAdvance = function() {
    nextTaskIndexInChallenge =  $scope.game.challenges[$scope.gameState.challengeIndex].tasks[$scope.gameState.taskIndex+1]
    nextChallengeIndex       =  $scope.game.challenges[$scope.gameState.challengeIndex+1]
    if (nextTaskIndexInChallenge != undefined) {
      $scope.gameState.taskIndex++
    }
    else if (nextChallengeIndex != undefined) { // assuming every challenge has tasks
      $scope.gameState.challengeIndex++
      $scope.gameState.taskIndex = 0
    }
    else {
      $scope.gameState.gameFinished = true
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
    return $scope.gameState.challengeIndex > challenge.index
  }

  challengeCurrent = function(challenge) {
    return $scope.gameState.challengeIndex == challenge.index
  }

  challengeAvailable = function(challenge) {
    return challengeSolved(challenge) || challengeCurrent(challenge)
  }  

  taskSolved = function(task) {
    return $scope.gameState.challengeIndex > task.challengeIndex || $scope.gameState.challengeIndex == task.challengeIndex && $scope.gameState.taskIndex > task.index || $scope.gameState.gameFinished
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

  taskConditionGetTemplateName = function(task) {
    for (var prop in task.condition) {
      break;
    }
    console.log(prop)
    return prop
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

  gameSave = function() {
    saveString = angular.toJson($scope.gameState, false);
    $cookies.K2020game = saveString
    console.log("game saved")
  }

  gameLoad = function() {
    saveString = $cookies.K2020game;
    if (saveString != undefined) {
      $scope.gameState = JSON.parse(saveString)
      console.log("game loaded")
      console.log($scope.gameState)
      return true
    }
    else return false
  }


  // location service for tasks
  $scope.goTask = function ( t ) {
    $scope.activeTask = t
    $location.path( "/task" )
    $scope.slideDirection = "inside"
    // find correct answer(s)
    $scope.conditionValue = ""
  }

  //current template
  $rootScope.$on('$routeChangeSuccess', function(){ 
     $scope.template = $route['current']['loadedTemplateUrl']
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
    check_challenge_solved: function(challenge) {if (taskSolved(challenge)) return '<i class="fa fa-check"></i>'},
  }

  $scope.html = html

  $scope.forms = {};
  $scope.$watch('forms.condition', function(form) {
    if(form) {
      var fform = form
      $scope.$watch('forms.condition.$valid', function(valid) {
        if(fform.$valid && !fform.$pristine) {
          console.log("task solved (detected)")
          gameAdvance()
          scrollTaskSolved()
          form.$setPristine()
          form.$setValidity(false)
        }
      });
    }
  });

  scrollTaskSolved = function() {
    var elem = angular.element(document.getElementById('task-scrollable'));
    var scrollableContentController = elem.controller('scrollableContent');
    // - Scroll to top of containedElement
    var containedElement = angular.element(document.getElementById('condition-solved'));
    scrollableContentController.scrollTo(containedElement);  
  }

  $scope.scrollTaskSolved = scrollTaskSolved

}]);
