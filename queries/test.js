var testArray = [];
for(var i = 0; i < 100; i++){
  testArray.push({
    index: i
  });
}

this.run = function(app, finished) {
  finished(testArray);
}
