var dotenvResult = require('dotenv').config();
var dotenv = require('dotenv');

var request = require('request');
var fs = require('fs');
var gitHubAPI = require('./githubAPI.js');

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

function getRecommend(err, obj) {
    var starredURLs = [];

    //grabs the starred_urls from each object and removing the {/owner}{/repo} string from each
    for (var index in obj) {
        var str = obj[index].starred_url.split("{/owner}{/repo}").join('');
        starredURLs.push(str);
    }

    getStarredURL(starredURLs, starredURLs.length);
}

function getStarredURL(starredURLs, count) {
    var starredCounts = {}

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

function parseStarredResponse(err, res, body) {
    var starredCounts = {};
    var obj = JSON.parse(body);
    
    for (let index in obj){
        let starred = obj[index].full_name;
        
        if (starredCounts[starred] == undefined){
            starredCounts[starred] = 1;
        } else {
            starredCounts[starred] += 1;
        }
    }

    console.log(starredCounts);
}

main();