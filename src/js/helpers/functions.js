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
