const express = require("express");
const router = express();

const path = require("path");
var randomstring = require("randomstring");
const querystring = require("querystring");

const LOCAL_URL = process.env.LOCAL_URL;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// Give express access to the styles folder
router.use(express.static(path.join(__dirname, "..", "/styles")));
router.use(express.static(path.join(__dirname, "..", "/scripts")));

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
        console.log("RESULT: ", result);
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

//Spotify User Auth
router.get("/", async (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  // // Check to ensure the user has been properly authenticated
  // if (state === null) {
  //   return res.redirect(
  //     "/" + querystring.stringify({ error: "State mismatch" })
  //   );
  // } else if (code === null) {
  //   return res.redirect("/" + querystring.stringify({ error: "Login failed" }));
  // }

  // Exchange the authorization code for an access token
  // One the access token is received, redirects the user to the user page and passes the token
  token = await getAccessToken(code);
  const profileImg = await getUserProfile(token);

  res.send({ response: { token: token, profileImg: profileImg } });
});

module.exports = router;
