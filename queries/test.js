this.run = function(app, finished) {
  var testArray = [];
  for(var i = 0; i < 10; i++){
    testArray.push(global.createPostObject(i,undefined,undefined,undefined,undefined,undefined));
  }
  finished(testArray);
}
