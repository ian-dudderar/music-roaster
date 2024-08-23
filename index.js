const express = require("express");
const app = express();
const port = 3000;
var path = require("path");

var randomstring = require("randomstring");
const querystring = require("querystring");

require("dotenv").config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const openai_key = process.env.OPENAI_KEY

const { OpenAI } = require("openai")
const openai = new OpenAI({
  apiKey: openai_key
});


app.use(express.static(path.join(__dirname, "/styles")));

async function printwords(tracks) {
  var inputString = "";
  for (const track of tracks) {
    var trackInfo = track.name + " by " + track.artist + ", ";
    inputString += trackInfo
  }
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a funny music critic." },
        {
            role: "user",
            content: "Based on the following songs and musical artists, write approximately 2 to 3 paragraphs roasting the user for their music choices. Be sure to acknowledge and poke fun at their most popular genre if they have one, or their lack thereof. The response should be both rude and funny. " + inputString,
        },
    ],
  });

  console.log(completion.choices[0].message.content);
}

function parseTrackInfo(songData) {
  var tracks = [];
  for (const song of songData) {
    var track = {name: song.name, artist: song.artists[0].name}
    tracks.push(track)
  }
  // printwords(tracks)
}

// Index Page
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});



app.get("/user", (req, res) => {
  var url = "https://api.spotify.com/v1/me/top/tracks?limit=10";
  fetch(url, {
    headers: {
      Authorization: "Bearer " + req.query.token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      data = result.items;
      parseTrackInfo(data);
    });

  res.sendFile("pages/index.html", { root: __dirname });

});

// Callback function for spotify authentication
app.get("/callback", (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  // Check to ensure the user has been properly authenticated
  if (state === null) {
    res.redirect("/" + querystring.stringify({ error: "State mismatch" }));
  } else if (code === null) {
    res.redirect("/" + querystring.stringify({ error: "Login failed" }));
  }

  // Exchange the authorization code for an access token
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    `Basic ` +
      new Buffer.from(client_id + ":" + client_secret).toString("base64")
  );
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("code", code);
  urlencoded.append("redirect_uri", "http://localhost:3000/callback");
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  // One the access token is received, redirects the user to the user page and passes the token
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      var token = result.access_token;
      res.redirect("/user?token=" + token);
    });
});

//Spotify User Auth
app.get("/authenticate", (req, res) => {
  var state = randomstring.generate(16);
  var scope = "user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        scope: scope,
        state: state,
        show_dialog: true,
        redirect_uri: "http://localhost:3000/callback",
        client_id: client_id,
      })
  );
});

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
