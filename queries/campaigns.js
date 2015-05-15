this.run = function(app, finished) {
  global.request
   .get("http://www.dosomething.org/api/v1/campaigns.json?parameters[is_staff_pick]=1")
   .end(function(err, res) {
     var data = res.body;
     var searchTerm = "";
     data.forEach(function(element, index, array) {
      searchTerm += '"' + element.title + '"' + ' OR ';
     });
     global.twitterClient.get('search/tweets', {q: searchTerm, count: 100}, function(error, tweets, response){
       var posts = [];
       if(!error) {
         tweets.statuses.forEach(function(element, index, array){
           var post = global.createPostObjectFromTweet(element);
           posts.push(post);
         });
       }
       finished(posts);
     });
   });
}

//Add in the data for Each a call to the instagram API
//After all of those are done running call the Twitter
//client and have it search the entire query string
//Call finish with all of the posts.
