function translate_markdown_nodes(o ) {
    for (i in o) {
        if (typeof(o[i])=="object") {
            translate_markdown_nodes(o[i] );
        }
        else {
          if (["en","de","tr"].indexOf(i) != -1) {
            o[i] = markdown.toHTML(o[i])
          }          
        }
    }
}         

function add_indexes(game) {
    for (challengeIndex in game.game.challenges) {
        game.game.challenges[challengeIndex].index = parseInt(challengeIndex)
        for (taskIndex in game.game.challenges[challengeIndex].tasks) {
            game.game.challenges[challengeIndex].tasks[taskIndex].index = parseInt(taskIndex)
            game.game.challenges[challengeIndex].tasks[taskIndex].challengeIndex = parseInt(challengeIndex)
        }
    }
}         
