var path = require('path'),
    teddy = require('teddy');

model = require(path.join(__dirname, 'model.js'))(function(model, err) {
  var template = document.getElementsByTagName('template')[0],
      loading = document.getElementById('loading'),
      content = template.innerHTML,
      renderedTemplate;
  
  model.stocks.sort(function(a,b) {return (b.percent - a.percent || b.change - a.change || b.price - a.price)});
  
  renderedTemplate = teddy.render(content, model);

  if (!err) {
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate);
    loading.setAttribute('hidden', 'hidden');
  }
  else {
    renderedTemplate = '<p class=\'error\'>Error retrieving data from server</p>'
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate);
    loading.setAttribute('hidden', 'hidden');
  }
});