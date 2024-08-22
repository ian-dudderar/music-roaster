const express = require("express");
const app = express();
const port = 3000;
var path = require("path");

var randomstring = require("randomstring");
const querystring = require("querystring");

require("dotenv").config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.use(express.static(path.join(__dirname, "/styles")));

// Index
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

// // Home page
// app.get("/home", (req, res) => {
//   const code = req.query.code;

//   // Check to ensure the user has been authenticated
//   if (!code) {
//     res.redirect("/");
//   }

//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
//   myHeaders.append(
//     "Authorization",
//     `Basic ` +
//       new Buffer.from(client_id + ":" + client_secret).toString("base64")
//   );
//   const urlencoded = new URLSearchParams();
//   urlencoded.append("grant_type", "authorization_code");
//   urlencoded.append("code", code);
//   urlencoded.append("redirect_uri", "http://localhost:3000/home");
//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: urlencoded,
//   };
//   fetch("https://accounts.spotify.com/api/token", requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       var token = result.access_token;
//       res.redirect("/user?token=" + token);
//     });
// });

app.get("/user", (req, res) => {
  var url = "https://api.spotify.com/v1/me/top/tracks?limit=10";
  fetch(url, {
    headers: {
      Authorization: "Bearer " + req.query.token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
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
  // res.redirect(
  //   "https://accounts.spotify.com/authorize?response_type=code&client_id=" +
  //     client_id +
  //     "&scope=user-top-read&redirect_uri=http://localhost:3000/home&show_dialog=true"
  // );
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
