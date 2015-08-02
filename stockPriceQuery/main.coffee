Rx = require 'rx'
request = require 'request'
_ =  require 'lodash'

getPrice = (stockSymbol, year, month, date) ->
  Rx.Observable.fromNodeCallback(request)
    url: "http://localhost:3000/#{stockSymbol}/#{year}/#{month}/#{date}"
    json: true
  .map ([resp, body]) ->
    body

Rx.Observable.from ['MSFT', 'GOOG', 'YHOO', 'LNKD', 'AMZN']
.flatMap (stockSymbol) ->
  Rx.Observable.range 1, 30
  .flatMap (date) ->
    getPrice stockSymbol, 2014, 8, date
  .filter (dailyPriceSnapshot) ->
    dailyPriceSnapshot isnt undefined
  .map (dailyPriceSnapshot) ->
    dailyGain = (dailyPriceSnapshot.Close - dailyPriceSnapshot.Open) / dailyPriceSnapshot.Open
    _.extend dailyGain: dailyGain, dailyPriceSnapshot
.subscribe (item) ->
  console.log item