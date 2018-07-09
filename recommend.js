var dotenvResult = require('dotenv').config();
var dotenv = require('dotenv');

var request = require('request');
var fs = require('fs');
var gitHubAPI = require('./githubAPI.js');

//global variables, will remove when a better solution can be found
var starredCounts = {};
var numStarred = 0;
var counter = 0;

console.log('Welcome to the GitHub Recommend Thingy!');

//main function for error checking and program flow
function main() {
    var args = process.argv.slice(2);
    if (args.length != 2) {
        console.log("incorrect arguments");
        console.error("Please input a repo owner and repo name");
    } else {
        var repoOwner = args[0];
        var repoName = args[1];

        gitHubAPI(repoOwner, repoName, getRecommend);
    }
}

//goes through the contributors object and grabs all the starredURLs
function getRecommend(err, obj) {
    var starredURLs = [];

    //grabs the starred_urls from each object and removing the {/owner}{/repo} string from each
    for (var index in obj) {
        var str = obj[index].starred_url.split("{/owner}{/repo}").join('');
        starredURLs.push(str);
    }

    getStarredURL(starredURLs, starredURLs.length);
}

//goes through the list of starred URLs and calls each one to get its starred list
function getStarredURL(starredURLs, count) {
    numStarred = count;

    for (let url of starredURLs) {
        var options = {
            url: url,
            headers: {
                'User-Agent': 'request',
                'Authorization': process.env.GITHUB_TOKEN
            }
        };
        request(options, parseStarredResponse);
    }
}

//for every response for a user's starred repos, add onto the global starredCounts object
function parseStarredResponse(err, res, body) {
    var obj = JSON.parse(body);

    //adds starred repo into counting obj, if none exists init count
    for (let index in obj) {
        let starred = obj[index].full_name;

        if (starredCounts[starred] == undefined) {
            starredCounts[starred] = 1;
        } else {
            starredCounts[starred] += 1;
        }
    }

    //uses a global counter to see if it is the last response to come back
    counter++;
    console.log("Processing starred repo #" + counter + " of " + numStarred);

    //sorts and displays the highest 5 element
    if (counter == numStarred) {
        sortObjectValues(starredCounts);
    }
}

main();

//sorting object based on values
//algorithm idea from https://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
function sortObjectValues(obj){
    var tempArr = [];

    for (var key in obj){
        tempArr.push([key, obj[key]]);
    }

    tempArr.sort(function(a, b){
        return b[1] - a[1];
    });

    for (let i = 0; i < 5; i++){
        console.log("[ " + tempArr[i][1] + " stars ] " + tempArr[i][0]);
    }
}
