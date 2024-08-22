npm init -y 
npm i express
npm i -D nodemon
create index.js file

you can copy a starter hello world index.js file from https://expressjs.com/en/starter/hello-world.html

in the package.json add a "start" script to run the command "nodemon index.js", so then you can just do npm start to run

create pages folder, and inside of pages create index.html file

copied bootstrap example into index.html


FOR .ENV FILE
npm i dotenv
create .env file
require("dotenv").config(); in file
use process.env.variable_name to use env variable
git init
git add .
git commit -m "Initial Commit"
git remote add github <project url>
git remote -v
git push github master


Spotify Auth used here
https://developer.spotify.com/documentation/web-api/tutorials/code-flow