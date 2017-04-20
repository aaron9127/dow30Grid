var request = require('request');

module.exports = function(done) {
  var stockList = [
        'MCD&f=nsl1c1p2',
        'DIS&f=nsl1c1p2',
        'WMT&f=nsl1c1p2',
        'BA&f=nsl1c1p2',
        'VZ&f=nsl1c1p2',
        'PG&f=nsl1c1p2',
        'UTX&f=nsl1c1p2',
        'UNH&f=nsl1c1p2',
        'MMM&f=nsl1c1p2',
        'NKE&f=nsl1c1p2',
        'TRV&f=nsl1c1p2',
        'GE&f=nsl1c1p2',
        'KO&f=nsl1c1p2',
        'MRK&f=nsl1c1p2',
        'HD&f=nsl1c1p2',
        'JNJ&f=nsl1c1p2',
        'V&f=nsl1c1p2',
        'MSFT&f=nsl1c1p2',
        'XOM&f=nsl1c1p2',
        'CAT&f=nsl1c1p2',
        'AXP&f=nsl1c1p2',
        'INTC&f=nsl1c1p2',
        'CVX&f=nsl1c1p2',
        'PFE&f=nsl1c1p2',
        'IBM&f=nsl1c1p2',
        'JPM&f=nsl1c1p2',
        'CSCO&f=nsl1c1p2',
        'GS&f=nsl1c1p2',
        'DD&f=nsl1c1p2',
        'AAPL&f=nsl1c1p2',
        'BAC&f=nsl1c1p2',
        'DPZ&f=nsl1c1p2'
      ],
      stockListLength = stockList.length,
      stockUri,
      csvList = [],
      counter = 0,
      model = {},
      i;

  for (i = 0; i < stockListLength; i++) {
    (function(i) {
      stockUri = stockList[i];

      request('http://finance.yahoo.com/d/quotes.csv?s=' + stockUri, function(err, res, body) {
        if (!err && res.statusCode === 200) {
          csvList.push(body);
          if (counter++ == stockListLength - 1) {
            computeStocks(csvList);
          }
        }
        else {
          console.error(err);
          done(model, err);
        }
      });
    })(i);
  }

  function computeStocks(csv) {
    var csvLength = csv.length,
        csvMember,
        csvMemberArr,
        stocks = [];

    for (i = 0; i < csvLength; i++) {
      csvMember = csv[i];
      csvMember = csvMember.replace(/"|, inc/gi, '');

      csvMemberArr = csvMember.split(',');

      csvMemberArr[0] = csvMemberArr[0]
        .replace(/e\.i\..*/i, 'Du Pont')
        .replace(/merck.*/i, 'Merck & Co')
        .replace(/(( compan)|( corp)|( incorp)|(\.)|( communica)|( stores)|( common)|( inc)|( group)|( \& co.)).*/i, '')
        .replace(/international business machines/i, 'IBM');

      csvMemberArr[2] = round(Number(csvMemberArr[2]), 2).toFixed(2);
      csvMemberArr[3] = round(Number(csvMemberArr[3]), 2).toFixed(2);
      csvMemberArr[4] = csvMemberArr[4].slice(0, -2);
      csvMemberArr[4] = Number(csvMemberArr[4]);

      if (csvMemberArr[3] > 0) {
        csvMemberArr.push('positive');
      }
      else if (csvMemberArr[3] === 0) {
        csvMemberArr.push('neutral')
      }
      else {
        csvMemberArr.push('negative')
      }

      stocks.push({
        name: csvMemberArr[0],
        symbol: csvMemberArr[1],
        price: csvMemberArr[2],
        change: csvMemberArr[3],
        percent: csvMemberArr[4],
        class: csvMemberArr[5]
      });
    }

    function compare(a,b) {
      if (a.percent < b.percent)
        return 1;
      if (a.percent > b.percent)
        return -1;
      return 0;
    }

    function round(value, exp) {
      if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

      value = +value;
      exp = +exp;

      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

      // Shift
      value = value.toString().split('e');
      value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
    }

    stocks.sort(compare);
    model.stocks = stocks;

    done(model);
  };
};
