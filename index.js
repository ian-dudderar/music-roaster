const express = require("express");
const app = express();
const port = 3000;
var path = require("path");

// var randomstring = require("randomstring");
// const querystring = require("querystring");

require("dotenv").config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const openai_key = process.env.OPENAI_KEY;

const LOCAL_URL = process.env.LOCAL_URL;
const API_URL = "https://api.spotify.com/v1/me/top/";

const authentication = require("./routes/authentication");
const main = require("./routes/main");

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: openai_key,
});

// Give express access to the styles folder
app.use(express.static(path.join(__dirname, "/styles")));
app.use(express.static(path.join(__dirname, "/scripts")));

//-----Helper Functions------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// converts boolean strings to booleans
function parseBoolean(string) {
  return string === "true" ? true : string === "false" ? false : undefined;
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
    urlencoded.append("redirect_uri", `${LOCAL_URL}/spotify/callback`);
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

async function getUserProfile(token) {
  console.log("fetching user profile...");
  console.log("TOKEN: " + token);
  const url = `https://api.spotify.com/v1/me`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        resolve(result.images[0].url);
      });
  });
}

async function getTrackData(token, grade = false, playlistId = null) {
  const url = grade
    ? `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    : `https://api.spotify.com/v1/me/top/tracks?limit=10`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        resolve(parseTrackData(result.items, grade));
      });
  });
}

function parseTrackData(track_data, grade) {
  let tracks = [];
  for (let data of track_data) {
    if (grade) {
      data = data.track;
    }
    let track = {
      name: data.name,
      artist: data.artists[0].name,
      album_image: data.album.images[0].url,
      preview_url: data.preview_url,
    };
    tracks.push(track);
  }
  return tracks;
}

function getPlaylists(token) {
  const url = `https://api.spotify.com/v1/me/playlists`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        resolve(parsePlaylists(result));
      });
  });
}

function parsePlaylists(playlists) {
  var data = [];
  for (const playlist of playlists.items) {
    const image = playlist.images ? playlist.images[0] : null;
    const name = playlist.name;
    const id = playlist.id;
    const tracks = playlist.tracks.total;
    data.push({ name: name, image: image, tracks: tracks, id: id });
  }
  return data;
}

async function getLLMResponse(tracks) {
  var prompt = `You are a funny music critic, who gives 0-5 star reviews on playlists. (0.5 increments are allowed).  Based on the following playlist information, write 2 brief paragraphs giving a review of the playlist. The 3rd and final paragraph should be ONLY the number 0-5 (0.5 increments) to announce the number of stars the playlist has received.
To help you with your review, consider the following information. The length of the playlist, the variety of the playlist, and the assumed purpose of the playlist. You should use the name of the playlist to help you determine the strength its content. If you do not understand the playlists name, you may disregard it. Because your review is brief, you should be fairly direct and to the point, with maybe a quick joke or two, and some constructive criticism or some acknowledgement of things they did poorly. `;

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

  // for (const track of tracks) {
  //   var trackInfo = track.name + " by " + track.artist + ", ";
  //   inputString += trackInfo;
  // }

  // const completion = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: "You are a funny music critic." },
  //     {
  //       role: "user",
  //       content:
  //         "Based on the following songs and musical artists, write approximately 2 to 3 paragraphs roasting the user for their music choices. Be sure to acknowledge and poke fun at their most popular genre if they have one, or their lack thereof. The response should be both rude and funny. " +
  //         inputString,
  //     },
  //   ],
  // });
  // llm_response = completion.choices[0].message.content;
  // text_response = llm_response.split("\n\n");

  return "";
  // return text_response;
}

//---------End Helper Functions---------

app.use("/spotify", authentication);
app.use("/main", main);

//-----Routes------
// Index Page
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

// app.get("/main", async (req, res) => {
//   console.log("HIT MAIN");
//   var code = req.query.code || null;
//   var state = req.query.state || null;

//   // // Check to ensure the user has been properly authenticated
//   // if (state === null) {
//   //   return res.redirect(
//   //     "/" + querystring.stringify({ error: "State mismatch" })
//   //   );
//   // } else if (code === null) {
//   //   return res.redirect("/" + querystring.stringify({ error: "Login failed" }));
//   // }

//   // Exchange the authorization code for an access token
//   // One the access token is received, redirects the user to the user page and passes the token
//   token = await getAccessToken(code);
//   const profileImg = await getUserProfile(token);

//   res.send({ response: { token: token, profileImg: profileImg } });
// });

app.get("/roast", (req, res) => {
  res.sendFile("pages/response.html", { root: __dirname });
});

app.get("/select-playlist", (req, res) => {
  res.sendFile("pages/playlists.html", { root: __dirname });
});

app.get("/get-playlists", async (req, res) => {
  const token = req.query.token;
  playlists = await getPlaylists(token);
  res.send({ response: playlists });
});

app.get("/grade", async (req, res) => {
  res.sendFile("pages/response.html", { root: __dirname });
  // res.sendFile("pages/test.html", { root: __dirname });
});

app.get("/response", async (req, res) => {
  const { token, playlistId } = req.query;
  const grade = parseBoolean(req.query.grade);
  const tracks = await getTrackData(token, grade, playlistId);

  let trackImages = [];
  for (const track of tracks) {
    trackImages.push(track.album_image);
  }
  console.log(trackImages);

  // const text_res = await getLLMResponse(tracks);

  await sleep(3000);
  console.log("responding");
  const fakeres = [
    "Hac feugiat cubilia curae aliquam vehicula diam. Primis nec enimcommodo sapien sagittis fermentum magna. Fermentum vulputate velitturpis pharetra cras euismod. Eget metus pharetra cursus pretium duis venenatis. Senectus vel hendrerit felis, himenaeos mollis finibus. Dignissim porttitor ridiculus ligula tellus ante morbi id elementum primis. Dolor proin mi hendrerit ultricies in felis. Feugiat cras odio tristique; rutrum taciti parturient quis hac. Viverra auctor rhoncus metus; imperdiet diam dui taciti? Lacus phasellus pellentesque tempor scelerisque vestibulum nascetur tincidunt?",
  ];

  // res.send({});
  res.send({ images: trackImages, textRes: fakeres });
});

// Error Page
// app.get("/error", (req, res) => {
//   res.sendFile("pages/error.html", { root: __dirname });
// });

// app.get("*", (req, res) => {
//   res.redirect("/error");
// });

// app.get("/test", (req, res) => {
//   res.redirect("/grade?playlist=123");
// });
//---------End Routes---------

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${LOCAL_URL}`);
});
