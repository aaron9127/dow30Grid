const got = require('got')
const moment = require('moment')

module.exports = (done) => {
  let symbolList = 'MCD,DIS,WMT,BA,VZ,PG,UTX,UNH,MMM,NKE,TRV,WBA,KO,MRK,HD,JNJ,V,MSFT,XOM,CAT,AXP,INTC,CVX,PFE,IBM,JPM,CSCO,GS,DWDP,AAPL'
  let model = {}

  /**
   * Public utility functions
   */
  function round (value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
  }

  function compare (a, b) {
    return b.percent - a.percent || b.change - a.change || b.price - a.price
  }

  (async () => {
    try {
      const response = await got(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbolList}&types=quote`)
      parseStockData(JSON.parse(response.body))
    } catch (err) {
      console.log(err.response.body)
      done(model, err)
    }
  })()

  function parseStockData (stockData) {
    let stocks = []
    let cssClass
    let symbol
    let i

    for (i in stockData) {
      symbol = stockData[i].quote

      // sanitize company names
      symbol.companyName = symbol.companyName
        .replace(/e\.i\..*/i, 'Du Pont')
        .replace(/merck.*/i, 'Merck & Co')
        .replace(/Sachs Group.*/i, 'Sachs')
        .replace(/the /i, '')
        .replace(/(( compan)|( corp)|( incorp)|(\.)|( communica)|( stores)|( common)|( boots alliance)|( inc)|( & co.)).*/i, '')
        .replace(/international business machines/i, 'IBM')

      // select CSS class based on change
      if (symbol.change > 0) {
        cssClass = 'positive'
      } else if (symbol.change === 0) {
        cssClass = 'neutral'
      } else {
        cssClass = 'negative'
      }

      stocks.push({
        name: symbol.companyName,
        symbol: symbol.symbol,
        price: symbol.latestPrice.toFixed(2),
        change: symbol.change.toFixed(2),
        percent: round(symbol.changePercent * 100, 2),
        class: cssClass
      })
    }

    stocks.sort(compare)

    model.stocks = stocks
    model.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a')

    done(model)
  }
}
