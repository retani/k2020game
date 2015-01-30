angular.module('K2020.controllers.Main', ['ngSanitize', 'ngCookies'])

.controller('MainController', function($scope, $http, $location, $route, $rootScope, $cookies) {
  // init language
  $scope.lang = "de"

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
  }).error(function() {
    alert("Game data not available")
  })

  // game state
  gameReset = function() {
    $scope.gameState = {
      challengeIndex: 0,
      taskIndex: 0,
      gameStarted: true,
      gameFinished: false
    }
    gameSave()
    console.log("game reset")
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
    return $scope.gameState.challengeIndex > task.challengeIndex || $scope.gameState.challengeIndex == task.challengeIndex && $scope.gameState.taskIndex > task.index
  }

  taskCurrent = function(task) {
    return $scope.gameState.challengeIndex == task.challengeIndex && $scope.gameState.taskIndex == task.index
  }

  taskAvailable = function(task) {
    return taskSolved(task) || taskCurrent(task)
  }

  $scope.gameAdvance = gameAdvance
  $scope.gameReset = gameReset
  $scope.taskSolved = taskSolved
  $scope.taskCurrent = taskCurrent
  $scope.taskAvailable = taskAvailable
  $scope.challengeAvailable = challengeAvailable

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
  }

  //current template
  $rootScope.$on('$routeChangeSuccess', function(){ 
     $scope.template = $route['current']['loadedTemplateUrl']
  });

  //slide scroll direction
  $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){ 
     slideDistance = (prevRoute == undefined) ? 0 : currRoute.depth - prevRoute.depth
     //$scope.slideDirection = slideDistance > 0 ? "inside" : slideDistance == 0 ? "same" : "outside"
     console.log($scope.slideDirection)
  });

});
