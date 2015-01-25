angular.module('K2020.controllers.Main', [])

.controller('MainController', function($scope, $http){
  $http.get("yaml/game.yaml").success(function (data) {
    console.log("YAML loaded (" + data.length + " characters)")
    var game = jsyaml.load(data)
    translate_markdown_nodes(game)
    $scope.game = game.game
    console.log($scope.game)
  }).error(function() {
    alert("Game data not available")
  })
});
