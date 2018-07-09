var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb){
    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': secrets.GITHUB_TOKEN
        }
    };
    
    request(options, function(err, res, body) {
        var obj = JSON.parse(body);
        cb(err, obj);
    });
}

function iterateAvatars(err, obj){
    if (err){
        throw err;
    }

    for (var index in obj){
        console.log(obj[index].avatar_url);
    }
}

getRepoContributors("jquery", "jquery", iterateAvatars);