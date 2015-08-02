Rx = require 'rx'
request = require 'request'

getPrice = (stockSymbol, year, month, date) ->
  Rx.Observable.fromNodeCallback(request)
    url: "http://localhost:3000/#{stockSymbol}/#{year}/#{month}/#{date}"
    json: true
  .map ([resp, body]) ->
    body

getPrice 'MSFT', 2014, 8, 1
.subscribe (item) ->
  console.log item