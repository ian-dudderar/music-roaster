const express = require("express");
const router = express();

const path = require("path");
var randomstring = require("randomstring");
const querystring = require("querystring");

const LOCAL_URL = process.env.LOCAL_URL;
const client_id = process.env.CLIENT_ID;

// Give express access to the styles folder
router.use(express.static(path.join(__dirname, "..", "/styles")));
router.use(express.static(path.join(__dirname, "..", "/scripts")));

//Spotify User Auth
router.get("/authenticate", (req, res) => {
  var state = randomstring.generate(16);
  var scope =
    "user-top-read playlist-read-private user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        scope: scope,
        state: state,
        show_dialog: true,
        redirect_uri: `${LOCAL_URL}/spotify/callback`,
        client_id: client_id,
      })
  );
});

// Callback function for spotify authentication
router.get("/callback", (req, res) => {
  if (req.query.error) {
    console.log("ERROR");
    res.redirect("/error");
  } else {
    res.sendFile("pages/main.html", { root: path.join(__dirname, "..") });
  }
});

module.exports = router;
