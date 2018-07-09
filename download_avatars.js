var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': secrets.GITHUB_TOKEN
        }
    };

    request(options, function (err, res, body) {
        var obj = JSON.parse(body);
        cb(err, obj);
    });
}

function downloadImageByURL(url, filePath) {
    var path = filePath;
    request.get(url)
        .on('error', function (err) {
            throw err;
        })
        .on('response', function (response){
            //function to catch the .png or .jpg file type, and add path accordingly
            let contentType = response.headers['content-type'];
            if (contentType == "image/png"){ filePath += ".png"; }
            else { filePath += ".jpg"; }
        })
        .pipe(fs.createWriteStream(filePath));
}

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

getRepoContributors("jquery", "jquery", iterateAvatars);