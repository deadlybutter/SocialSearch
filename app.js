// Load diff. social modules + config
// Perform searches -Load all files under 'queries' or something and call the run function, pass instance of this
// Save data -Do dev mode checks to determine how to save (or if we should even run the query)
// Perform evaluations -Load all files under 'Evaluations' or something and call the run function, pass instance of this
// Output the data -Load the output script

// We need a common data format that everything in this app uses & can be translated into from the search

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

//this.instagramClient.use({access_token: config.instagram.access_token});
//this.instagramClient.use({client_id: config.instagram.client_id, client_secret: config.instagram.client_secret});

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
        if(points >= config.misc.min_score && evaluatedResults.indexOf(result) == -1) {
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
}

loadQueries();
