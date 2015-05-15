var posts = [];
var totalTerms = 0;
var termsSearched = 0;

this.run = function(app, finished) {
  global.request
   .get("http://www.dosomething.org/api/v1/campaigns.json?parameters[is_staff_pick]=1")
   .end(function(err, res) {
     var data = res.body;
     var searchTerm = "";
     totalTerms = data.length * 2;
     data.forEach(function(element, index, array) {
      searchTerm = element.title.replace(/[\W_]+/g,"");
      global.instagramClient.tag_media_recent(searchTerm.replace(/ /g, ""), function(err, result, remaining, limit) {
        result.forEach(function(element, index, array) {
          posts.push(global.createPostObjectFromInstagram(element));
        });
        termsSearched++;
        searchFinished(finished);
      });
      global.twitterClient.get('search/tweets', {q: '"' + searchTerm + '"', count: 100}, function(error, tweets, response) {
        if(!error) {
          tweets.statuses.forEach(function(element, index, array){
            var post = global.createPostObjectFromTweet(element);
            posts.push(post);
          });
        }
        termsSearched++;
        searchFinished(finished);
      });
    });
  });
}

function searchFinished(queryFinish) {
 if(termsSearched >= totalTerms) {
   queryFinish(posts);
 }
}
