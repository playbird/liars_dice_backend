const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5000

//global game state
const game = {
  users: []
};

function getUserCount() {
  let count = game.users.length;
  return count;
} 

function rootHandler(req, res) {
  res.render('pages/index');
}

function getGameForUser(userID) {
   let privateGame = {
    users: []
    };
   for (var i = 0; i < game.users.length; i++) { 
    if (game.users[i].id == userID) {
      privateGame.users.push(game.users[i]);
    } else {
      let otherUser =  {
        id: game.users[i].id,
        dice: game.users[i].dice.length,
        name: game.users[i].name
      };
      privateGame.users.push(otherUser);
      };
    }
  return privateGame;
}

function gamesHandler(req, res) {
  let userID = req.query.userID;
  if (userID == 'new') {
    // if new user, create an ID, if not, skip to game
    userID = Math.random().toString();
    let newUser = {
      id: userID,
      dice: playersDice(5),
      name: "player " + (getUserCount() + 1)
    };
    game.users.push(newUser);
  }
  let myGame = getGameForUser(userID);
  let response = {
    me: userID,
    game: myGame
  };
  res.send(response);
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

