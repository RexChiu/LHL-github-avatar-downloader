var dotenvResult = require('dotenv').config();
var dotenv = require('dotenv');

var request = require('request');

//function to grab the contributors of a given github repo
module.exports = function getRepoContributors(repoOwner, repoName, cb) {
    //throws error if .env does not exist
    if (dotenvResult.error) {
        throw dotenv.error;
    }

    //throw error if .env does not have the token
    if (!process.env.GITHUB_TOKEN) {
        throw new Error(".env does not have proper token");
    }

    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': process.env.GITHUB_TOKEN
        }
    };

    //sends request to specified URL, converts response into JSON object and calls callback function
    //error checks for http status codes
    request(options, function (err, res, body) {
        //repo does not exist
        if (res.statusCode == 404) {
            throw new Error("Provided GitHub Owner/Repo does not exist!");
        }
        //bad github token credentials
        if (res.statusCode == 401) {
            throw new Error("Provided GitHub token invalid");
        }
        var obj = JSON.parse(body);
        cb(err, obj);
    });
};