const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

function rootHandler(req, res) {
  console.log(req);
  res.render('pages/index');
}
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))