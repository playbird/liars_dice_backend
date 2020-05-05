const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

//global game state
const game = {
  users: []
};

function rootHandler(req, res) {
  res.render('pages/index');
}
function gamesHandler(req, res) {
  // to do--check for a user ID
  const userID = Math.random().toString();
  game.users.push({
    id: userID,
    dice: []
  });
  res.send({
    me: userID, 
    game: game
  });
}
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .get('/games', gamesHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))