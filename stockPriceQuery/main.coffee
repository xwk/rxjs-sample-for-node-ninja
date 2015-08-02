Rx = require 'rx'
request = require 'request'

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
.subscribe (item) ->
  console.log item