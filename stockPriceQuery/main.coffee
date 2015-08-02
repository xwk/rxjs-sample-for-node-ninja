Rx = require 'rx'
request = require 'request'
_ =  require 'lodash'

getPrice = (stockSymbol, year, month, date) ->
  Rx.Observable.fromNodeCallback(request)
    url: "http://localhost:3000/#{stockSymbol}/#{year}/#{month}/#{date}"
    json: true
  .map ([resp, body]) ->
    body

symbolAnDateObservable = Rx.Observable.from ['MSFT', 'GOOG', 'YHOO', 'LNKD', 'AMZN']
.flatMap (stockSymbol) ->
  Rx.Observable.range 1, 30
  .map (date) ->
    stockSymbol: stockSymbol
    date: date
.zip Rx.Observable.interval(1000), (symbolAnDate, _) ->
  symbolAnDate

#     getPrice stockSymbol, 2014, 8, date
#   .filter (dailyPriceSnapshot) ->
#     dailyPriceSnapshot isnt undefined
#   .map (dailyPriceSnapshot) ->
#     dailyGain = (dailyPriceSnapshot.Close - dailyPriceSnapshot.Open) / dailyPriceSnapshot.Open
#     _.extend dailyGain: dailyGain, dailyPriceSnapshot
# .maxBy (dailyPriceSnapshot) ->
#   dailyPriceSnapshot.dailyGain
symbolAnDateObservable.subscribe (item) ->
  console.log item