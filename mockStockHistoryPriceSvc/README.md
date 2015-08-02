#A mock up of stock history service

#How to run
    npm install
    npm start

#Query interface
http://localhost:3000/<StockSymbol>/<Year>/<Month>/<Day>

For example, http://localhost:3000/YHOO/2014/8/4
It will return a json like below
    {
     "Symbol": "YHOO",
     "Date": "2014-08-04",
     "Open": "35.709999",
     "High": "36.66",
     "Low": "35.650002",
     "Close": "36.529999",
     "Volume": "13097200",
     "Adj_Close": "36.529999"
    }

If the market is closed for the day, a 404 will be returned.

As being a mockup, only the histroy data during the August of 2014 for following stocks are avaiable

 *YHOO
 *MSFT
 *GOOG
 *FB
 *LNKD
 *AMZN