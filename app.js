global.TWITTER = "TWITTER";
global.INSTAGRAM = "INSTAGRAM";

var fs = require('fs');
var util = require('util');
var config = require(__dirname + "/config.json");

global.request = require("superagent");

var twitterAPI = require("twitter");
global.instagramClient = require("instagram-node").instagram();

// Configure clients
global.twitterClient = new twitterAPI({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});
global.instagramClient.use({client_id: config.instagram.client_id, client_secret: config.instagram.client_secret});

Array.prototype.comparePost = function(o){
  for (var i = 0; i < this.length; i++) {
    if (this[i].username == o.username && this[i].url == o.url && this[i].photo_url == o.photo_url && this[i].text == o.text && this[i].platform == o.platform) {
      return i;
    }
  }
  return -1;
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

global.createPostObjectFromInstagram = function(element) {
  var screenName = element.user.username;
  var url = element.link;
  var photo_url = element.images.standard_resolution.url;
  var text = element.caption.text;
  var platform = global.INSTAGRAM;
  var data = {
    full_name: element.user.full_name
  }
  var post = global.createPostObject(screenName, url, photo_url, text, platform, data);
  return post;
}

global.createPostObjectFromTweet = function(element) {
  var screen_name = element.user.screen_name;
  var url = "twitter.com/" + screen_name + "/" + element.id_str;
  var photo_url = "";
  if (element.entities.media != undefined) {
    if(element.entities.media.media_url != undefined) {
      photo_url = element.entities.media.media_url.replace(/\\/g, '');
    }
  }
  var text = element.text;
  var platform = global.TWITTER;
  var data = {
    full_name: element.user.name,
    reply: (element.in_reply_to_status_id == null && element.in_reply_to_user_id == null && element.in_reply_to_screen_name == null ? false : true)
  }
  var post = global.createPostObject(screen_name, url, photo_url, text, platform, data);
  return post;
}

global.createPostObject = function(username, url, photo_url, text, platform, data) {
  return {
    username: username,
    url: url,
    photo_url: photo_url,
    text: text,
    platform: platform,
    data: data
  }
}

global.containsBadWords = function(text) {
  var words = require(__dirname + '/badwords').words;
  var toCheck = text.toLowerCase();
  var foundWord = false;
  words.forEach(function(element, index, array) {
    if(foundWord) {
      return;
    }
    if(toCheck.indexOf(element) != -1){
      console.log(element, text);
      foundWord = true;
    }
  });
  return foundWord;
}

function loadQueries(){
  var queryDir = __dirname + '/queries';
  var queries = config.queries;
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
  var evaluations = config.evaluations;
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
