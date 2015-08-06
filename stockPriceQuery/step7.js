var Rx = require('rx');
var request = require('request');
var _ = require('lodash');
var gapBetweenRequests = 200;

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
    .map(function(stockSymbol) {
      return {
        stockSymbol: stockSymbol,
        date: date
      };
    });
})
.zip(Rx.Observable.interval(gapBetweenRequests), function(params, _) {
  return params;
})
.flatMap(function(params) {
  return getPrice(params.stockSymbol, 2014, 8, params.date);
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




