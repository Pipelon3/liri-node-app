var Spotify = require('node-spotify-api');
var argument = process.argv[3];
const keys = require('./keys.js');
var request = require('request');
var bandsintown = require('bandsintown');
var fs = require('fs');


var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.api_key;


const command = process.argv[2];
const secondCommand = process.argv[3];

switch (command) {
    case ('spotify-this-song'):
        if(secondCommand){
            spotifyThisSong(secondCommand);
         } else{
            spotifyThisSong("Money Trees");
         }
    break;

    case ('concert-this'):
        if(secondCommand){
            concertThis(secondCommand);
        } else{
            concertThis("Kendrick Lamar");
        }
    break;
    case ('movie-this'):
        if(secondCommand){
            omdb(secondCommand);
        } else{
            omdb("Pulp Fiction");
        }
    break;
    case ('do-what-it-says'):
         doThing();
    break;
    default:
        console.log('Try again');
};

function concertThis(){
  bandsintown.getArtistEventList(argument).then(function (events) {

  console.log(`
  ${'Band: ' + argument}
  ${'Venue Name: ' + events[0].venue.name}
  ${'Location: ' + events[1].formatted_location}
  ${'Date: ' + moment(events[0].datetime).format('L')}`);
  fs.appendFile('log.txt', `
  ${argument}
  Venue Name: ${events[0].venue.name}
  Location: ${events[1].formatted_location}
  Date: ${moment(events[0].datetime).format('L')}
  `,

function (err) {
    if (err) throw err;
    console.log('Saved to log.txt!');
      });
    })
  .catch(function (err) {
    console.log(err.statusMessage);
  });
};

function spotifyThisSong(song){
  spotify.search({ type: 'track', query: song, limit: 1}, function(error, data){
      if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
                    //artist
          console.log("Artist: " + songData.artists[0].name);
                    //song
          console.log("Song: " + songData.name);
                    //preview link
          console.log("Preview URL: " + songData.preview_url);
                    //album
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          } 
      } else {
      console.log('Error occurred.');
      }
    });
}

function omdb(movie){
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=trilogy&plot=short&tomatoes=true';
      
    request(omdbURL, function (error, response, body){
      if(!error && response.statusCode == 200){
        var body = JSON.parse(body);
      
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            
      } else{
        console.log('Error occurred.', response)
      }
    });
      
}
      
function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');
      
    spotifyThisSong(txt[1]);
  });
}