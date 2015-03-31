# k2020game

#Agentenspiel für K2020.

URL des Spiels: http://agent.k2020.berlin
URL des Projekts: http://k2020.berlin


##Requirements:
- node
- npm
- gulp

##Installation:

```
git clone ...
npm install
gulp
````

Läuft auf: http://localhost:8000

##Texte ändern

Interface: src/yaml/template.yaml
Spieltexte: src/yaml/game.yaml

Danach: 
- gulp build
- [testen]
- [commit to git repository]

##Deployment

Deploy to Heroku at http://k2020game.herokuapp.com/

