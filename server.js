const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')

const PORT = process.env.PORT || 5000

//global game state
const game = {
  users: [],
  observers: [],
  reveal: false,
  previousBid: {
    player: null,
    diceVal: 2,
    diceAmt: 0
  } 
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

function isIt(userID) {
  if (game.users.length > 1) {
    let itUser = game.users[1];
    if (itUser.id == userID) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function getGameForUser(userID) {
  let obs = userToObserver(game);
  let privateGame = {
    users: [],
    observers: obs,
    isOver: isGameOver(),
    diceTotal: diceAll(),
    previousBid: game.previousBid,
    isIt: isIt(userID)
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

function userToObserver(game) {
  for (let i = 0; i < getUserCount(); i++) {
    let outOfGame;
    if (game.users[i].dice.length == 0) {
      outOfGame = game.users[i];
      game.observers.push(outOfGame);
      game.users.splice([i], 1);
    }
  }
  return game.observers;
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

function revealHandler() {
  game.reveal = true;
}

function advanceItUser () {
  let arr = game.users;
  arr.push(arr.shift());
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

function checkBid() {
  let users = game.users;
  let n = 0;
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].dice.length; j++) {
      if ((users[i].dice[j] == game.previousBid.diceVal) || (users[i].dice[j] == 1)) {
        n = n++;
      }
    }
  }
  if (n >= game.previousBid.diceAmt) {
    users[1].dice.pop();
  } else {
    users[0].dice.pop();
  }
  game.previousBid.diceAmt = 0;
  game.previousBid.diceVal = 2;
  reroll();
}

function removeHandler(req, res) {
  revealHandler();
  setTimeout(checkBid, 2000);
  res.send();
}
function bidHandler(req, res) {
  game.previousBid = req.body.latestBid;
  res.send(game.previousBid);
  advanceItUser();
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', rootHandler)
  .post('/users', createUserHandler)
  .get('/games', gamesHandler)
  .post('/games', newGameHandler)
  .delete('/users/dice', removeHandler)
  .post('/bids', bidHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))