this.run = function(app, finished) {
  global.instagramClient.tag_media_recent('dosomething', function(err, result, remaining, limit) {
    var posts = [];
    result.forEach(function(element, index, array) {
      var postDate = new Date(element.caption.created_time * 1000);
      var today = new Date();
      if((today - postDate)/(1000*60*60*24) <= 3) {
        posts.push(global.createPostObjectFromInstagram(element));
      }
    });
    finished(posts);
  });
}
