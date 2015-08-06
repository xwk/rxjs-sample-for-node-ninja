var Rx = require('rx');
var request = require('request');
var _ = require('lodash');

getPrice = function(stockSymbol, year, month, date) {
  return Rx.Observable.fromNodeCallback(request)({
    url: "http://localhost:3000/" + stockSymbol + "/" + year + "/" + month + "/" + date,
    json: true
  })
  .map(function(arg) {
    var body = arg[1];
    return body;
  });
};

Rx.Observable.range(1, 30)
.flatMap(function(date){
  return getPrice('MSFT', 2014, 8, date);
})
.subscribe(function(item) {
  console.log(item);
});
