this.eval = function(item, app, finished) {
  var points = 0;
  var text = item.text.toLowerCase();

  if(text.indexOf("@dosomething") != -1 || text.indexOf("#dosomething")) {
    points += 1;
  }

  if(text.indexOf("proud") != -1 || text.indexOf(" happy ") != -1) {
    points += 1;
  }

  if(text.indexOf("donate") != -1 || text.indexOf("donated") != -1) {
    points += 1;
  }

  if(text.indexOf("follow") != -1) {
    points -= 1;
  }

  if(item.photo_url == "") {
    points -= 2;
  }

  if(global.containsBadWords(text)) {
    points -= 4;
  }

  global.request
   .get("http://www.dosomething.org/api/v1/campaigns.json?is_staff_pick=1")
   .end(function(err, res) {
     var data = res.body;
     data.forEach(function(element, index, array) {
       var searchTerm = element.title;
       var hashtag = '#' + searchTerm.replace(/[\W_]+/g,"");
       if(text.indexOf(searchTerm) != -1) {
         points += 1;
       }
       else if(text.indexOf(hashtag) != -1) {
         points += 1;
       }
     });
     finished(points);
   });
}
