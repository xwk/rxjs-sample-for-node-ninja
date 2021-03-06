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
  return Rx.Observable.from(['MSFT', 'GOOG', 'YHOO', 'LNKD', 'AMZN'])
    .flatMap(function(stockSymbol) {
      return getPrice(stockSymbol, 2014, 8, date);
    });
})
.filter(function(dailyPriceSnapshot) {
  return dailyPriceSnapshot !== undefined;
})
.map(function(dailyPriceSnapshot) {
  return _.extend({
    dailyGain: (dailyPriceSnapshot.Close - dailyPriceSnapshot.Open) / dailyPriceSnapshot.Open,
  }, dailyPriceSnapshot);
})
.maxBy(function(dailyPriceSnapshot) {
  return dailyPriceSnapshot.dailyGain;
})
.subscribe(function(item) {
  console.log(item);
});

