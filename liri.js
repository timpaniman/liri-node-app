var keys = require('./keys.js');
var Twitter = require('Twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var song = process.argv[3];
var movie = process.argv[3];

if (process.argv[3] == null) {
    song = 'The Sign';
    movie = 'Nobody';
}

// Twitter setup
var client = new Twitter(
    keys
);

// Spotify setup
var spotify = new Spotify({
    id: '7626c96f29ef41a6ab800f2d4c8f4978',
    secret: '9eafdb7576a84e3bb3b703d0d67f2aad'
});

console.log('Welcome to Liri');

switch (command) {
    case `my-tweets`:
        console.log('Displaying Tweets:');
        client.get('search/tweets', { q: 'timpaniman' }, function(error, tweets, response) {
            if (!error) {
                console.log(tweets);
                console.log('done');
            } else { console.log(error); }
        });

        break;

    case `spotify-this-song`:
        console.log(`Displaying Spotify`);

        spotify
            .search({ type: 'track', query: song })
            .then(function(response) {
                console.log(response.tracks.items[0]);
                for (var i = 0;
                    (i < response.tracks.items.length && i < 10); i++) {
                    console.log('====== Song Info =========');
                    console.log(response.tracks.items[i].name);
                    console.log(response.tracks.items[i].artists[0].name);
                    console.log(response.tracks.items[i].preview_url);
                    console.log(response.tracks.items[i].album.name);

                }
            })
            .catch(function(err) {
                console.log(err);
            });

        break;
    case `movie-this`:
        console.log(`Displaying movies`);
        request('http://www.omdbapi.com/?apikey=40e9cece&t=' + movie, function(error, response, body) {
            //    console.log('error:', error); // Print the error if one occurred
            //    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received        
            //  console.log('body:', body); // Print the HTML for the Google homepage.()

            if (error == null) {
                var moviejson = JSON.parse(body);
                console.log('\n');
                console.log(moviejson.Title);
                console.log(moviejson.Released);
                console.log(moviejson.Ratings[0]);
                console.log(moviejson.Ratings[1]);
                console.log(moviejson.Country);
                console.log(moviejson.Language);
                console.log(moviejson.Plot);
                console.log(moviejson.Actors);
            } else { console.log('Error'); }
        });
        break;

    case `do-what-it-says`:
        console.log(`do-what-it-says`);
        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr[1]);
            song = dataArr[1];
        });
        spotify_execute(song);

        break;

    default:
        console.log('Invalid Command');
}

// END
function spotify_execute(song) {
    spotify
        .search({ type: 'track', query: song })
        .then(function(response) {

            for (var i = 0;
                (i < response.tracks.items.length && i < 10); i++) {
                console.log('====== Song Info =========');
                console.log(response.tracks.items[i].name);
                console.log(response.tracks.items[i].artists[0].name);
                console.log(response.tracks.items[i].preview_url);
                console.log(response.tracks.items[i].album.name);

            }
        })
        .catch(function(err) {
            console.log(err);
        });
}