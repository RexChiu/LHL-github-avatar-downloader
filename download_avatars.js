var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb){
    var requestURL = 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors";
    console.log(requestURL);
}

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
  });