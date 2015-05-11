this.eval = function(item, app, finished) {
  var points = 0;
  var text = item.text.toLowerCase();
  if(text.indexOf("i") == 0 && text.charAt(1) == " "){
    points += 1;
  }
  if(text.indexOf("wanna") != -1 || text.indexOf("want") != -1){
    points += 1;
  }
  if(text.search("do something") != -1) {
    points += 1;
  }
  if(text.indexOf("bored") != -1) {
    points += 1;
  }
  if(item.data.reply) {
    points -= 2;
  }
  if(text.indexOf("RT") != -1) {
    points -= 3;
  }
  if(text.indexOf("you") != -1) {
    points -= 1;
  }
  if(item.platform == global.TWITTER){
    if(item.text.length >= 120) {
      points -= 1;
    }
  }
  finished(points);
}
