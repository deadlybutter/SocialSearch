this.run = function(app, finished) {
  global.twitterClient.get('search/tweets', {q: '"do something" OR dosomething OR @dosomething', count: 100}, function(error, tweets, response){
     if(!error) {
       var posts = [];
       tweets.statuses.forEach(function(element, index, array){
         var post = global.createPostObjectFromTweet(element);
         posts.push(post);
       });
       finished(posts);
     }
  });
}
