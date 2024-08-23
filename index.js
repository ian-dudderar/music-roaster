const express = require("express");
const app = express();
const port = 3000;
var path = require("path");

var randomstring = require("randomstring");
const querystring = require("querystring");

require("dotenv").config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const openai_key = process.env.OPENAI_KEY;

const API_URL = "https://api.spotify.com/v1/me/top/";

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: openai_key,
});

// Give express access to the styles folder
app.use(express.static(path.join(__dirname, "/styles")));

//-----Helper Functions------
async function fetchTrackData(token) {
  var url = `${API_URL}tracks?limit=3`;

  fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
  // return new Promise((resolve, reject) => {
  //   var url = `${API_URL}tracks?limit=3`;
  //   fetch(url, {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //     });
  // });
}

function parseTrackData(track_data) {
  var tracks = [];
  for (const data of track_data) {
    var track = {
      name: data.name,
      artist: data.artists[0].name,
      album_image: data.album.images[0].url,
      preview_url: data.preview_url,
    };
    tracks.push(track);
  }
  return tracks;
}

// async function fetchArtistData(token) {
//   var url = `${API_URL}artists?limit=5`;
//   fetch(url, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       data = result.items;
//       parseTrackInfo(data);
//     });
// }

// async function printwords(tracks) {
//   var inputString = "";
//   for (const track of tracks) {
//     var trackInfo = track.name + " by " + track.artist + ", ";
//     inputString += trackInfo;
//   }

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: "You are a funny music critic." },
//       {
//         role: "user",
//         content:
//           "Based on the following songs and musical artists, write approximately 2 to 3 paragraphs roasting the user for their music choices. Be sure to acknowledge and poke fun at their most popular genre if they have one, or their lack thereof. The response should be both rude and funny. " +
//           inputString,
//       },
//     ],
//   });

//   console.log(completion.choices[0].message.content);
// }

//---------End Helper Functions---------

//-----Routes------

app.get("/test", (req, res) => {
  res.send({ message: "TEST DATA" });
});

// Index Page
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
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
      res.redirect("/home?token=" + token);
    });
});

app.get("/home", async (req, res) => {
  // console.log(req.query.token);
  fetchTrackData(req.query.token);
  // const track_data = await fetchTrackData(req.query.token);
  // console.log(track_data);
  // const tracks = parseTrackData(track_data);
  // console.log(tracks);

  res.sendFile("pages/home.html", { root: __dirname });
});
//---------End Routes---------

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
