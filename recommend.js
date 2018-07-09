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

function getRecommend(err, obj){
    console.log(obj);
}

main();