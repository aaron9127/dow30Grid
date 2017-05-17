var request = require('request'),
    moment = require('moment');

module.exports = (done) => {
  var stockList = 'MCD+DIS+WMT+BA+VZ+PG+UTX+UNH+MMM+NKE+TRV+GE+KO+MRK+HD+JNJ+V+MSFT+XOM+CAT+AXP+INTC+CVX+PFE+IBM+JPM+CSCO+GS+DD+AAPL',
      stockMetadata = '&f=nsl1c1p2',
      csvList,
      model = {},
      i;

  /**
   * Public utility functions
   */
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

  function compare(a,b) {
    return b.percent - a.percent || b.change - a.change || b.price - a.price;
  }

  // request promise
  function req(url) {
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (!err && res.statusCode === 200 && body) {
          resolve(body);
        }
        else {
          reject(err);
        }
      });
    });
  }

  req(`http://finance.yahoo.com/d/quotes.csv?s=${stockList}${stockMetadata}`).then((body) => {
    computeStocks(body);
  }, (err) => {
    console.error(err);
    done(model, err);
  });

  function computeStocks(csv) {
    var csvArrLength,
        csvMember,
        csvMemberArr,
        stocks = [];

    csv = csv.replace(/"|, inc/gi, '').split('\n'),
    csvArrLength = csv.length;

    for (i = 0; i < csvArrLength; i++) {
      csvMember = csv[i];

      if (csvMember) {
        csvMemberArr = csvMember.split(',');

        csvMemberArr[0] = csvMemberArr[0]
          .replace(/e\.i\..*/i, 'Du Pont')
          .replace(/merck.*/i, 'Merck & Co')
          .replace(/the /i, '')
          .replace(/(( compan)|( corp)|( incorp)|(\.)|( communica)|( stores)|( common)|( inc)|( group)|( \& co.)).*/i, '')
          .replace(/international business machines/i, 'IBM');

        csvMemberArr[2] = round(Number(csvMemberArr[2]), 2).toFixed(2);
        csvMemberArr[3] = round(Number(csvMemberArr[3]), 2).toFixed(2);
        csvMemberArr[4] = Number(csvMemberArr[4].slice(0, -2));

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

    stocks.sort(compare);

    model.stocks = stocks;
    model.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');

    done(model);
  };
};
