angular.module('K2020.controllers.Main', ['ngSanitize'])

.controller('MainController', function($scope, $http, $location, $route, $rootScope) {
  // init language
  $scope.lang = "de"

  // load game data
  $http.get("yaml/game.yaml").success(function (data) {
    console.log("YAML loaded (" + data.length + " characters)")
    var game = jsyaml.load(data)
    translate_markdown_nodes(game)
    $scope.game = game.game
    console.log($scope.game)
    // init view
    $scope.activeTask = $scope.game.challenges[0].tasks[0]
  }).error(function() {
    alert("Game data not available")
  })

  // TODO: game state

  // location service for tasks
  $scope.goTask = function ( t ) {
    $scope.activeTask = t
    $location.path( "/task" )
  }

  //current template
  $rootScope.$on('$routeChangeSuccess', function(){ 
     $scope.template = $route['current']['loadedTemplateUrl']
  });

});
