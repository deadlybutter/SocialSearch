this.run = function(app, finished) {
  global.twitterClient.get('search/tweets', {q: '"do something" OR dosomething OR @dosomething'}, function(error, tweets, response){
     if(!error) {
       //console.log(tweets.statuses[0]);
       var posts = [];
       tweets.statuses.forEach(function(element, index, array){
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
         posts.push(post);
       });
       finished(posts);
     }
  });
}
