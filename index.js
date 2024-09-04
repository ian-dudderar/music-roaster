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

const LOCAL_URL = process.env.LOCAL_URL;
const API_URL = "https://api.spotify.com/v1/me/top/";

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: openai_key,
});

// Give express access to the styles folder
app.use(express.static(path.join(__dirname, "/styles")));

//-----Helper Functions------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAccessToken(code) {
  return new Promise((resolve, reject) => {
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
    urlencoded.append("redirect_uri", `${LOCAL_URL}/callback`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch("https://accounts.spotify.com/api/token", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        var token = result.access_token;
        resolve(token);
      });
  });
}

async function fetchTrackData(token) {
  console.log("fetching");

  const url = `${API_URL}tracks?limit=10`;
  return new Promise((resolve, reject) => {
    // var url = `${API_URL}tracks?limit=3`;
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        resolve(parseTrackData(result.items));
      });
  });
}

function parseTrackData(track_data) {
  console.log("parsing...");
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

async function roast_tracks(tracks) {
  // console.log("sleeping...");
  // await sleep(2000);
  // console.log("done sleeping");
  // var res = [
  //   "Lorem ipsum odor amet, consectetuer adipiscing elit. Suspendisse tortor ac aliquet; mattis ipsum at venenatis? Porttitor rhoncus vestibulum litora fringilla vitae porttitor laoreet. Fames ultricies ac nulla, scelerisque habitant ligula. Erat viverra ornare interdum posuere dis dui. Tortor ac mauris nullam elit pulvinar tempus. Cubilia eu turpis risus per mauris.",
  //   "Placerat praesent non proin vulputate tincidunt penatibus duis tristique. Est laoreet justo erat fringilla tristique lacinia quisque suspendisse. Purus eu est duis; quis nostra pharetra natoque fusce. Ultricies commodo sit parturient justo luctus; cursus congue torquent. Nec nullam erat mi rutrum sodales dapibus. Accumsan iaculis arcu habitasse euismod aliquet integer diam nisl. Rutrum augue pulvinar mi ac phasellus vehicula. Lectus donec nisl netus ante pharetra facilisi luctus fermentum inceptos. Dolor ac orci risus vehicula sagittis integer.",
  //   "Sagittis magnis taciti urna viverra litora facilisi. Ullamcorper gravida molestie augue morbi potenti. Sem velit mollis placerat metus feugiat eleifend. Fusce felis purus at urna montes vivamus lobortis morbi. Sed venenatis vel mauris bibendum pretium torquent vel. In malesuada torquent integer, mollis amet scelerisque natoque ullamcorper. Vitae lacinia egestas finibus amet magna nullam venenatis!",
  // ];

  // return res;

  var inputString = "";

  for (const track of tracks) {
    var trackInfo = track.name + " by " + track.artist + ", ";
    inputString += trackInfo;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a funny music critic." },
      {
        role: "user",
        content:
          "Based on the following songs and musical artists, write approximately 2 to 3 paragraphs roasting the user for their music choices. Be sure to acknowledge and poke fun at their most popular genre if they have one, or their lack thereof. The response should be both rude and funny. " +
          inputString,
      },
    ],
  });
  llm_response = completion.choices[0].message.content;
  text_response = llm_response.split("\n\n");

  // return "";
  return text_response;
}

//---------End Helper Functions---------

//-----Routes------
// Index Page
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

// Error Page
app.get("/error", (req, res) => {
  res.sendFile("pages/error.html", { root: __dirname });
});

app.get("*", (req, res) => {
  res.redirect("/error");
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
        redirect_uri: `${LOCAL_URL}/callback`,
        client_id: client_id,
      })
  );
});

// Callback function for spotify authentication
app.get("/callback", (req, res) => {
  res.sendFile("pages/main.html", { root: __dirname });
});

app.get("/main", async (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  // Check to ensure the user has been properly authenticated
  if (state === null) {
    res.redirect("/" + querystring.stringify({ error: "State mismatch" }));
  } else if (code === null) {
    res.redirect("/" + querystring.stringify({ error: "Login failed" }));
  }

  // Exchange the authorization code for an access token
  // One the access token is received, redirects the user to the user page and passes the token
  const token = await getAccessToken(code);
  const tracks = await fetchTrackData(token);
  const text_res = await roast_tracks(tracks);
  var albums = [];
  for (const track of tracks) {
    albums.push(track.album_image);
  }

  const data_response = {
    albums_res: albums,
    text_res: text_res,
  };

  // console.log(data_response);

  res.send({ response: data_response });
});

//---------End Routes---------

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${LOCAL_URL}`);
});
