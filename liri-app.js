var Spotify = require("node-spotify-api");
// var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

let queryURL = "http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=" + "59afb49d";


axios.get(queryURL).then(
  function(response) {
    console.log(response.data);
  },

  function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
);