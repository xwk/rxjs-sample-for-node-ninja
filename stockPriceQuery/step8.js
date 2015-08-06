//implement request retry with binary-back-off strategy

var Rx = require('rx');
var request = require('request');
var _ = require('lodash');
var gapBetweenRequests = 200;
var maxRetryTimes = 6;

getPrice = function(stockSymbol, year, month, date) {
  return Rx.Observable.just(1)
    .flatMap(function(){
      return  Rx.Observable.fromNodeCallback(request)({
          url: "http://localhost:3000/" + stockSymbol + "/" + year + "/" + month + "/" + date,
          json: true
        });
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
  return getPrice(params.stockSymbol, 2014, 8, params.date)
    .retryWhen(function(failedAttempts) {
      return failedAttempts.zip(Rx.Observable.range(1, maxRetryTimes), function(err, nthRetry) {
        return (Math.pow(2, nthRetry)) * 1000;
      })
      .flatMap(function(timeToWaitBeforeRetry) {
        console.log("delay retry by " + timeToWaitBeforeRetry + " ms(s)");
        return Rx.Observable.timer(timeToWaitBeforeRetry);
      })
      .concat(Rx.Observable["throw"](new Error('Too many failed attempts')));
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




