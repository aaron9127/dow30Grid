var path = require('path'),
    teddy = require('teddy');

model = require(path.join(__dirname, 'model.js'))(function(model, err) {
  var template = document.getElementsByTagName('template')[0],
      loading = document.getElementById('loading'),
      content = template.innerHTML,
      renderedTemplate = teddy.render(content, model),
      refreshButton = document.getElementById('refresh');

  if (!err) {
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate);
    loading.setAttribute('hidden', 'hidden');

    // refresh stocks every 15 minutes
    setInterval(function() {
      refreshButton.click();
    }, 900000);
  }
  else {
    renderedTemplate = '<p class=\'error\'>Error retrieving data from server</p>'
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate);
    loading.setAttribute('hidden', 'hidden');
  }
});
