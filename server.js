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

function isGameOver() {
  let users = game.users;
  let usersWithDice = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].dice.length >= 1) {
      usersWithDice ++;
    }
  }
  if ((usersWithDice <= 1) && (users.length > 1))  {
    return true;
  } else {
    return false;
  }
}

// returns newly created random array of ints
function playersDice(diceCount) {
  let arr = [];
  for (let i = 0; i < diceCount; i++ ) {
    let roll = Math.ceil(Math.random() * 6);
    arr.push(roll);
  }
  return arr;
}

function diceAll() {
  let count = 0;
  for (let i = 0; i < game.users.length; i++) {
    count = count + game.users[i].dice.length;
  }
  return count;
}

function anonymize(diceCount) {
  let arr = [];
  for (let i = 0; i < diceCount; i++) {
    arr.push('0');
  }
  return arr;
}

// returns a newly created user object
function createUserHandler(req, res) {
  let displayName = req.query.displayName;
  let userID = Math.random().toString();
  let newUser = {
    id: userID,
    dice: playersDice(5),
    name: displayName
  };
  game.users.push(newUser);
  let response = newUser;
  res.send(response);
}

function rootHandler(req, res) {
  res.render('pages/index');
}

function getGameForUser(userID) {
  let privateGame = {
    users: [],
    isOver: isGameOver(),
    diceTotal: diceAll()
  };
  for (var i = 0; i < getUserCount(); i++) {
    let user = game.users[i];
    if ((user.id == userID) || game.reveal) {
      privateGame.users.push(game.users[i]);
    } else {
      let otherUser =  {
        dice: anonymize(game.users[i].dice.length), 
        name: user.name
      };
      privateGame.users.push(otherUser);
    }
  }
  return privateGame;
}

function gamesHandler(req, res) {
  let userID = req.query.userID;
  let myGame = getGameForUser(userID);
  let response = {
    game: myGame
  };
  res.send(response);
}

function reroll() {
  for (let i = 0; i < getUserCount(); i++) {
    game.users[i].dice = playersDice(game.users[i].dice.length);
  }
  game.reveal = false;
}

function revealHandler(req, res) {
  game.reveal = true;
  res.send();
}

function advanceItUser () {
  let arr = game.users;
  arr.push(arr.shift());
  return game.users; 
}

function removeHandler(req, res) {
  advanceItUser();
  let userID = req.query.userID;
  for (var i = 0; i < getUserCount(); i++) {
    let loser = game.users[i].id;
    if (loser == userID) {
      game.users[i].dice.length -- ;
    }
    reroll();
  }
  res.send();
}

function newGameHandler(req, res) {
  for (var i = 0; i < getUserCount(); i++) {
    let user = game.users[i];
    let userID = req.query.userID;
    user.dice = playersDice(5);
    if (user.id == userID) {
      revealHandler();
    } 
  res.send();
  }
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .post('/users', createUserHandler)
  .get('/games', gamesHandler)
  .post('/users/dice', revealHandler)
  .post('/games', newGameHandler)
  .delete('/users/dice', removeHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))