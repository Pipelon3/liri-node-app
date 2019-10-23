require("dotenv").config(); 

const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require("moment");
const fs = require("fs");

let command = process.argv[2];
let value = process.argv.slice(3).join(" ");

switch(command){
  case "concert-this":
      bandsintownOutput(value);
    break;
  case "spotify-this-song":
    spotifyOutput(value);
    break;
  case "movie-this":
    omdbOutput(value);
    break;

  case "do-what-it-says":
    doWhatItSays(value);
    break;
  default: 
    console.log("Please enter one of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
}

/*---------SPOTIFY---------- */

function spotifyOutput(inputParameter) {
  if (inputParameter === undefined) {
      inputParameter = "Stronger";
  }
  spotify.search(
      {
          type: "track",
          query: inputParameter
      },
      function (err, data) {
          if (err) {
              console.log("Error occurred: " + err);
              return;
          }
          var songs = data.tracks.items;

          for (var i = 0; i < songs.length; i++) {
              console.log("**********SONG INFO*********");
              fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
              console.log(i);
              fs.appendFileSync("log.txt", i +"\n");
              console.log("Song name: " + songs[i].name);
              fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
              console.log("Preview song: " + songs[i].preview_url);
              fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
              console.log("Album: " + songs[i].album.name);
              fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
              console.log("Artist(s): " + songs[i].artists[0].name);
              fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
              console.log("*****************************");  
              fs.appendFileSync("log.txt", "*****************************\n");
           }
      }
  );
};

/*---------Bandsintown---------- */

function bandsintownOutput(value) {
  let bandsAPIKey = process.env.bandsintown_SECRET;
  let queryURL = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=" + bandsAPIKey
  axios.get(queryURL).then(
    function (response) {
      console.log(response.data[0].venue.name);
      console.log(response.data[0].venue.city);
      console.log(moment(response.data[0].datetime).format('MM/DD/YYYY'));
    },

    function (error) {
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
}

  /*---------OMDB Movies---------- */
  
function omdbOutput(value) {
  if(value === ""){
     value = "Pulp Ficton";
  }
  let OMDBapikey = process.env.OMDB_SECRET;
  let queryURL = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=" + OMDBapikey
  axios
    .get(queryURL)
    .then(
      function (response) {
        
        if(value ==="Pulp Fiction"){
          console.log("\nHere's a summary of Pulp Fiction: http://www.imdb.com/title/tt0110912/");
        }
        else{
          console.log("\nTitle of the Movie: " + response.data.Title);
          console.log("\nYear of the Movie: " + response.data.Year);
          console.log("\nIMDB rating of the Movie: " + response.data.imdbRating);
          console.log("\nRotten Tomatoes Rating of the Movie: " + response.data.Ratings[1].Value);
          console.log("\nCountry production of the Movie: " + response.data.Country);
          console.log("\nLanguage/s of the Movie: " + response.data.Language);
          console.log("\nPlot of the Movie: " + response.data.Plot);
          console.log("\nActors in the Movie: " + response.data.Actors);
        }
      },

      function (error) {
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
}

//Rotten Tomatoes

function getRottenTomatoesRatingObject (data) {
  return data.Ratings.find(function (item) {
     return item.Source === "Rotten Tomatoes";
  });
}

function getRottenTomatoesRatingValue (data) {
  return getRottenTomatoesRatingObject(data).Value;
}
  

function doWhatItSays(){
  fs.readFile("random.txt", "utf8", function (err, data) {
    
    if (err) {
      return console.log(err);
    }

    data = data.split(",");
    switch (data[0]) {
      case "concert-this":
          bandsintownOutput(data[1]);
        break;
      case "spotify-this-song":
        spotifyOutput(data[1]);
        break;
      case "movie-this":
        omdbOutput(data[1]);
        break;
    }
  });
}