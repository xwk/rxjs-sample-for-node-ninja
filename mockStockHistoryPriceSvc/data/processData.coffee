fs = require 'fs'
moment = require 'moment'
rawData = require './priceHistory.raw'

historyData = {}

rawData.forEach (data) ->
  datetime = moment(data.Date)

  year = datetime.year().toString()
  month = (datetime.month() + 1).toString()
  date = datetime.date().toString()

  if not historyData[data.Symbol]?
    historyData[data.Symbol] = {}

  if not historyData[data.Symbol][year]?
    historyData[data.Symbol][year] = {}

  if not historyData[data.Symbol][year][month]?
    historyData[data.Symbol][year][month] = {}

  historyData[data.Symbol][year][month][date] = data

fs.writeFileSync 'priceHistory.json', JSON.stringify(historyData, null, 2), 'utf8'
