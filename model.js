var request = require('request');

module.exports = function(done) {
  var stockList = 'MCD+DIS+WMT+BA+VZ+PG+UTX+UNH+MMM+NKE+TRV+GE+KO+MRK+HD+JNJ+V+MSFT+XOM+CAT+AXP+INTC+CVX+PFE+IBM+JPM+CSCO+GS+DD+AAPL',
      stockMetadata = '&f=nsl1c1p2',
      csvList,
      model = {},
      i;

  request('http://finance.yahoo.com/d/quotes.csv?s=' + stockList + stockMetadata, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      csvList = body;
      if (csvList) {
        computeStocks(csvList);
      }
      else {
        console.error('Stock list is empty');
        done(model, err);
      }
    }
    else {
      console.error(err);
      done(model, err);
    }
  });

  function computeStocks(csv) {
    var csvArr,
        csvArrLength,
        csvMember,
        csvMemberArr,
        stocks = [];

    csv = csv.replace(/"|, inc/gi, ''),

    csvArr = csv.split('\n');
    csvArrLength = csvArr.length;

    for (i = 0; i < csvArrLength; i++) {
      csvMember = csvArr[i];

      if (csvMember) {
        csvMemberArr = csvMember.split(',');

        csvMemberArr[0] = csvMemberArr[0]
          .replace(/e\.i\..*/i, 'Du Pont')
          .replace(/merck.*/i, 'Merck & Co')
          .repalce(/the travelers*/i, 'Travelers')
          .replace(/(( compan)|( corp)|( incorp)|(\.)|( communica)|( stores)|( common)|( inc)|( group)|( \& co.)).*/i, '')
          .replace(/international business machines/i, 'IBM');

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
    }

    function compare(a,b) {
      if (a.percent < b.percent)
        return 1;
      else if (a.percent > b.percent)
        return -1;
      else if (a.percent === b.percent) {
        if (a.change < b.change)
          return 1;
        if (a.change > b.change)
          return -1;
      }
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
