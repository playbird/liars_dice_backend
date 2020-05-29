const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5000

//global game state
const game = {
  users: [],
  reveal: false
};

function getUserCount() {
  let count = game.users.length;
  return count;
}

// returns newly created random array of ints
function playersDice(diceCount) {
  var arr = [];
  for (let i = 0; i < diceCount; i++ ) {
    var roll = Math.ceil(Math.random() * 6);
    arr.push(roll);
  }
  return arr;
}

// returns a newly created user object
function getNewUser() {
  let userID = Math.random().toString();
  let newUser = {
    id: userID,
    dice: playersDice(5),
    name: "player " + (getUserCount() + 1)
  };
  return newUser;
}

function rootHandler(req, res) {
  res.render('pages/index');
}

function getGameForUser(userID) {
  let privateGame = {
    users: []
  };
  for (var i = 0; i < getUserCount(); i++) {
    let user = game.users[i];
    if ((user.id == userID) || game.reveal) {
      privateGame.users.push(game.users[i]);
    } else {
      let otherUser =  {
        id: user.id,
        dice: user.dice.length,
        name: user.name
      };
      privateGame.users.push(otherUser);
    }
  }
  return privateGame;
}

function gamesHandler(req, res) {
  let userID = req.query.userID;
  if (userID == 'new') {
    let newUser = getNewUser();
    userID = newUser.id;
    game.users.push(newUser);
  }
  let myGame = getGameForUser(userID);
  let response = {
    me: userID,
    game: myGame
  };
  res.send(response);
}

function rollHandler(req, res) {
  for (let i = 0; i < getUserCount(); i++) {
    game.users[i].dice = playersDice(game.users[i].dice.length);
  }
  game.reveal = false;
  res.send();
}

function revealHandler(req, res) {
  game.reveal = true;
  res.send();
}

function removeHandler(req, res) {
  let userID = req.query.userID;
  for (var i = 0; i < getUserCount(); i++) {
    let loser = game.users[i].id;
    if (loser == userID) {
      game.users[i].dice.length -- ;
    }
  }
  res.send();
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .get('/games', gamesHandler)
  .post('/reroll', rollHandler)
  .post('/users/dice', revealHandler)
  .delete('/users/dice', removeHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
