var dotenvResult = require('dotenv').config();
var dotenv = require('dotenv');

var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

//function to grab the contributors of a given github repo
function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': process.env.GITHUB_TOKEN
        }
    };

    //sends request to specified URL, converts response into JSON object and calls callback function
    //error checks for status code 404 if repo/owner does not exist
    request(options, function (err, res, body) {
        if (res.statusCode == 404) {
            throw new Error("Provided GitHub Owner/Repo does not exist!");
        }
        var obj = JSON.parse(body);
        cb(err, obj);
    });
}

//function to download an image given a url, saves into a filepath
//saves as type .png or .jpg according to the type stored on the server
function downloadImageByURL(url, filePath) {
    var path = filePath;

    var options = {
        url: url,
        headers: {
            'User-Agent': 'request',
            'Authorization': process.env.GITHUB_TOKEN
        }
    };

    request(options, function (err, res, body) {
        if (res.statusCode != 200) {
            throw new Error("Some Error");
        }

        let contentType = res.headers['content-type'];
        if (contentType == "image/png") { filePath += ".png"; }
        else { filePath += ".jpg"; }

    }).pipe(fs.createWriteStream(filePath));

    // request.get(url)
    //     .on('error', function (err) {
    //         throw err;
    //     })
    //     .on('response', function (response) {

    //         //catch the .png or .jpg file type, and add path accordingly
    //         let contentType = response.headers['content-type'];
    //         if (contentType == "image/png") { filePath += ".png"; }
    //         else { filePath += ".jpg"; }
    //     })
    //     .pipe(fs.createWriteStream(filePath));
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
    //makes the avatars directory if it does not exist
    if (!fs.existsSync("./avatars")) {
        fs.mkdirSync("./avatars");
    }

    //throws error if .env does not exist
    if (dotenvResult.error) {
        throw dotenv.error;
    }

    var args = process.argv.slice(2);
    if (args.length != 2) {
        console.log("incorrect arguments");
        console.error("Please input a repo owner and repo name");
    } else {
        var repoOwner = args[0];
        var repoName = args[1];

        getRepoContributors(repoOwner, repoName, iterateAvatars);
    }
}

main();