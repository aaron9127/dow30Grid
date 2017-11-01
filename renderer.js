const path = require('path')
const teddy = require('teddy')

require(path.join(__dirname, 'model.js'))((model, err) => {
  let template = document.getElementsByTagName('template')[0]
  let loading = document.getElementById('loading')
  let content = template.innerHTML
  let renderedTemplate
  let refreshButton = document.getElementById('refresh')

  if (err) {
    renderedTemplate = '<p class=\'error\'>Error retrieving data from server</p>'
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate)
    loading.setAttribute('hidden', 'hidden')
  } else {
    renderedTemplate = teddy.render(content, model)
    document.body.insertAdjacentHTML('beforeEnd', renderedTemplate)
    loading.setAttribute('hidden', 'hidden')

    // refresh stocks every 15 minutes
    setInterval(() => {
      refreshButton.click()
    }, 900000)
  }
})
