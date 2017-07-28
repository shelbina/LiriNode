console.log("Type a command: \nmy-tweets \nspotify-this-song \nmovie-this \ndo-what-it-says")

///require npm variables
var keys = require("./keys.js");
var fs = require("fs");
var liriArg = process.argv[2];
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');


///set liri commands
switch(liriArg) {
  case "my-tweets": myTweets(); break;
  case "spotify-this-song": spotifyThisSong(); break;
  case "movie-this": movieThis(); break;
  case "do-what-it-says": doWhatItSays(); break;
}

///npm twitter function and link to keys
function myTweets(){
    var client = new Twitter({
      consumer_key: keys.twitterKeys.consumer_key,
      consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret,
    });
    var twitterUsername = process.argv[3];
    if (!twitterUsername){
      twitterUsername = "@TeacherDeel";
    }
		params = {screen_name: twitterUsername};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					//console.log(response); // Show the full response in the terminal
          ///my-tweets  show last 20 tweets, when created in terminal/bash
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + i + " ------------------------------" + "\r\n";
					console.log(twitterResults);
					log(twitterResults); // calling log function
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
}
/// Then run a request to the OMDB API with the movie specified
  ///movie-this  '<movie name here>' will output movie title, year released, IMBD raiting, 
  //Rotten Tomatoes Raiting, country produced, movie language, movie plot, movie actors
  ///if no movie is typed in  output data for Mr. Nobody
	function movieThis(){
		var movie = process.argv[3];
		if(movie === undefined){
			movie = "Mr. Nobody";
		}
		request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true&apikey=40e9cece", function (error, response, body) {
			if (!error && response.statusCode == 200) {
						movie = JSON.parse(body);
						console.log("Movie Title: " + movie.Title);
						console.log("Year of Release: " + movie.Year);
						console.log("IMDB Rating: " + movie.imdbRating);
						console.log(movie.Ratings[1].Source + " Rating: " + movie.Ratings[1].Value);
						console.log("Produced in " + movie.Country);
						console.log("Language(s): " + movie.Language);
						console.log("Plot: " + movie.Plot);
						console.log("Starring: " + movie.Actors);
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};
///install npm spotify keys
var spotify = new Spotify({
  id:'keys.spotifyKeys.SPOTIFY_CLIENT_ID',
  secret:'keys.spotifyKeys.SPOTIFY_CLIENT_SECRET',
});
///spotify-this-song  show song info in terminal/bash artist, 
///song name, preview link from spotify, song album, if no song default to "The Sign by Ace of Base"
	function spotifyThisSong(songName) {
		var songName = process.argv[3];
		if(songName === undefined){
			songName = "The Sign";
		}
		params = songName;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						log(spotifyResults); // calling log function
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
	};

	// / Do What It Says function, uses the reads and writes module to access the 
 //  /random.txt file and do what's written in it
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	/// Do What It Says function, uses the reads and writes module to access the 
  ///log.txt file and write everything that returns in terminal in the log.txt file
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}