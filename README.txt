This is a work-in-progress personal project I started out of curiosity of the Spotify API, as well as the drive to create something
funny for my friends.

The idea is to serve as mobile-friendly web application that allows the user to connect their Spotify account,
and have their music library 'roasted' by OpenAI.

I then wanted to take it a step further, and give them the ability to have their Spotify playlists rated
on a scale of 1-5 stars, in order to generate return usability.

All of this functionality exists in the code, but I got hung-up on the design aspect, as I could not find 
a way to display the AI's response in a manner I thought acceptable for production-level deployment.



npm run start

Spotify Auth used here
https://developer.spotify.com/documentation/web-api/tutorials/code-flow


// These are more relevant to node/express in general, not this project. I need to move them somewhere else
npm init -y 
npm i express
npm i -D nodemon
create index.js file

you can copy a starter hello world index.js file from https://expressjs.com/en/starter/hello-world.html

in the package.json add a "start" script to run the command "nodemon index.js", so then you can just do npm start to run

create pages folder, and inside of pages create index.html file

If you want to return an index file, ie, res.sendFile("pages/index.html", { root: __dirname }) on backend



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


