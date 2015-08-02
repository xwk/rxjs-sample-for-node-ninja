express = require 'express'
morgan = require 'morgan'

priceHistory = require './data/priceHistory'

app = express()

app.use morgan 'dev'

app.get '/:stockSymbol/:year/:month/:date', (req, res) ->
  stockSymbol = req.params.stockSymbol
  year = req.params.year
  month = req.params.month
  date = req.params.date

  console.log stockSymbol, typeof year, month, date
  priceData = priceHistory[stockSymbol]?[year]?[month]?[date]
  if priceData
    res.json priceData
  else
    res.status(404).end()

app.set 'port', process.env.PORT or 3000
server = app.listen app.get('port'), ->
  console.log 'Express server listening on port ' + server.address().port
