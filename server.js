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

function getGameForUser(user) {
  // loop through the users
  // if the userID == user then show dice
  // otherwise, hide dice
}

function gamesHandler(req, res) {
  let userID = req.query.userID;
  if(userID == 'new') {
    // if new user, create an ID, if not, skip to game
    userID = Math.random().toString();
    game.users.push({
      id: userID,
      dice: playersDice(5)
    });
  }

  res.send({
    me: userID,
    game: game // getGameForUser(userID)
  });
}

function playersDice(diceCount) {
  var arr = [];
  for (let i = 0; i < diceCount; i++ ) {
    var roll = Math.ceil(Math.random() * 6);
    arr.push(roll);
  }
  return arr;
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .get('/games', gamesHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

