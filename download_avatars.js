require('dotenv').config();

var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

//function to grab the contributors of a given github repo
function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': process.env.GITHUB_USERNAME + ":" + process.env.GITHUB_TOKEN
        }
    };

    //sends request to specified URL, converts response into JSON object and calls callback function
    request(options, function (err, res, body) {
        var obj = JSON.parse(body);
        cb(err, obj);
    });
}

//function to download an image given a url, saves into a filepath
//saves as type .png or .jpg according to the type stored on the server
function downloadImageByURL(url, filePath) {
    var path = filePath;
    request.get(url)
        .on('error', function (err) {
            throw err;
        })
        .on('response', function (response) {
            //catch the .png or .jpg file type, and add path accordingly
            let contentType = response.headers['content-type'];
            if (contentType == "image/png") { filePath += ".png"; }
            else { filePath += ".jpg"; }
        })
        .pipe(fs.createWriteStream(filePath));
}

//function to iterate over object returned from github API
//finds avatar URL and username to pass onto downloadImageByURL
function iterateAvatars(err, obj) {
    if (err) {
        throw err;
    }

    for (var index in obj) {
        let login = obj[index].login;
        let path = "avatars/" + login; //missing .jpg or .png here, will be added in downloadImageByURL
        let avatarURL = obj[index].avatar_url;

        downloadImageByURL(avatarURL, path);
    }
}

//main function for error checking and program flow
function main() {
    var args = process.argv.slice(2);
    if (args.length != 2) {
        console.error("Please input a repo owner and repo name");
    } else {
        var repoOwner = args[0];
        var repoName = args[1];

        getRepoContributors(repoOwner, repoName, iterateAvatars);
    }
}

main();