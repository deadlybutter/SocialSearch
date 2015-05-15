this.run = function(app, finished) {
  global.instagramClient.tag_media_recent('dosomething', function(err, result, remaining, limit) {
    var posts = [];
    result.forEach(function(element, index, array) {
      posts.push(global.createPostObjectFromInstagram(element));
    });
    finished(posts);
  });
}
