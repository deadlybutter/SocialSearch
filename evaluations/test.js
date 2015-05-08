this.eval = function(item, app, finished) {
  setTimeout(function() {
    finished(item.username % 2 == 0 ? 2 : 0);
  }, Math.random() * 1000);
}
