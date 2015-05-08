//TODO: We need a common data format that everything in this app uses & can be translated into from the search
//TODO: Documentation for writing evaluations & queries
//TODO: Write the actual fucking evaluations & queries...!

var fs = require('fs');
var util = require('util');
var config = require(__dirname + "/config.json");

var twitterAPI = require("twitter");
this.instagramClient = require("instagram-node").instagram();

// Configure clients
this.twitterClient = new twitterAPI({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

//TODO: Fix this shiz
//this.instagramClient.use({access_token: config.instagram.access_token});
//this.instagramClient.use({client_id: config.instagram.client_id, client_secret: config.instagram.client_secret});

Array.prototype.comparePost = function(o){
  for (var i = 0; i < this.length; i++) {
    if (this[i].username == o.username && this[i].fullname == o.fullname && this[i].url == o.url && this[i].photo_url == o.photo_url && this[i].text == o.text && this[i].platform == o.platform) {
      return i;
    }
  }
  return -1;
}

global.createPostObject = function(username, fullname, url, photo_url, text, platform) {
  return {
    username: username,
    fullname: fullname,
    url: url,
    photo_url: photo_url,
    text: text,
    platform: platform
  }
}

function loadQueries(){
  var queryDir = __dirname + '/queries';
  var queries = fs.readdirSync(queryDir);
  var totalQueries = queries.length;
  var finishedQueries = 0;
  var results = [];
  queries.forEach(function(element, index, array){
    var query = require(queryDir + '/' + element);
    query.run(this, function finished(data){
      results = results.concat(data);
      finishedQueries++;
      if(finishedQueries >= totalQueries) {
        evaluateResults(results);
      }
    });
  });
}

function evaluateResults(results){
  var evalDir = __dirname + '/evaluations';
  var evaluations = fs.readdirSync(evalDir);
  var evaluatedResults = [];
  var totalEvals = results.length * evaluations.length;
  var evalsCompleted = 0;
  results.forEach(function(result, index, array) {
    var points = 0;
    evaluations.forEach(function(evaluation, index, array) {
      var evalFunc = require(evalDir + '/' + evaluation);
      evalFunc.eval(result, this, function(score) {
        points += score;
        if(points >= config.misc.min_score && evaluatedResults.comparePost(result) == -1) {
          evaluatedResults.push(result);
        }
        evalsCompleted++;
        if(evalsCompleted >= totalEvals) {
          outputResults(evaluatedResults);
        }
      });
    });
  });
}

function outputResults(results) {
  console.log("OUTPUT--");
  console.log(util.inspect(results, false, null));
  //TODO: Make output script for Google Sheet
}

loadQueries();
