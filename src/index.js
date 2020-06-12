// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

let myID;
let gameState;
let displayName;
let isOver;

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function createUser(displayName) {
  return axios.post('/users?displayName=' + displayName);
}

function reveal() {
  axios.post('/users/dice')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function remove() {
  axios.delete('/users/dice?userID=' + myID)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function newGame() {
  axios.post('/games')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function showPlayButtons() {
  document.getElementById('reveal').style.display = 'inline';
  document.getElementById('remove').style.display = 'inline';
  document.getElementById('newGame').style.display = 'none';
}

function showNewGameButton() {
  document.getElementById('reveal').style.display = 'none';
  document.getElementById('remove').style.display = 'none';
  document.getElementById('newGame').style.display = 'inline';
}

function update(userID) {
  getGame(userID).then(response => {
    gameState = response.data.game;
    isOver = response.data.game.isOver;
    if (isOver) {
      showNewGameButton();
    } else {
      showPlayButtons();
    }
    drawGame(gameState, myID);
    setTimeout(update, 1000, myID);
  });
}

function initialize() {
  drawButtons();
  displayName = prompt("Type your name and click OK", "New Player");
  if (displayName == "") {
    displayName = "New Player";
  } 
  createUser(displayName).then(response => {
    myID = response.data.id;
    console.log(response.data);
    update(myID);
  });
}

function getImages(roll) {
  let arr = [];
  for (let i = 0; i < roll.length; i++) {
    if (roll[i] === 0) {
      arr.push('0.gif');
    } else {
      arr.push(roll[i] + '.gif');
    }
  }
  return arr;
} 

function drawGame(gameState, myID) {
  let doc = window.document;
  let gameDiv = document.getElementById('game');
  while (gameDiv.firstChild) {
    gameDiv.removeChild(gameDiv.firstChild);
  }
  let userCount = gameState.users.length;
  let diceCountDiv = doc.createElement('div');
  diceCountDiv.className = 'diceCount';
  gameDiv.appendChild(diceCountDiv);
  diceCountDiv.textContent = "There are  " + gameState.diceTotal + " dice in the game";  
  for (let i = 0; i < userCount; i++) {
    let roll = gameState.users[i].dice;
    let name = gameState.users[i].name;
    let player = doc.createElement('div');
    if (gameState.users[i].dice.length == 0) {
      player.className = 'explayer';
      player.textContent = name + " is out of the game";  
    } else {
      player.className = 'player';
      player.textContent = name + ":  ";
      let imageRoll = getImages(roll);
      for (let i = 0; i < imageRoll.length; i++) {
        diceValue = roll[i] + '.gif';
        let diceImg = doc.createElement('img');        
        diceImg.setAttribute('src', '/images/' + diceValue);
        diceImg.setAttribute('height', '32');
        diceImg.setAttribute('width', '32');
        document.getElementsByClassName('player');
        player.appendChild(diceImg);
      }    
    }
    gameDiv.appendChild(player);
  }
}

function drawButtons() {
  let doc = window.document;

  let revealButton = doc.createElement('button');
  doc.body.appendChild(revealButton);
  revealButton.id = 'reveal';
  revealButton.textContent = " Liar! ";
  revealButton.href = "#";
  revealButton.onclick = reveal;
  doc.body.appendChild( document.createTextNode( '\u00A0\u00A0' ) );

  let removeButton = doc.createElement('button');
  doc.body.appendChild(removeButton);
  removeButton.id = 'remove';
  removeButton.textContent = " Remove a dice ";
  removeButton.href = "#";
  removeButton.onclick = remove;
  doc.body.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
  
  let newGameButton = doc.createElement('button');
  doc.body.appendChild(newGameButton);
  newGameButton.id = 'newGame';
  newGameButton.style.display = 'none';
  newGameButton.textContent = " Play Again? ";
  newGameButton.href = "#";
  newGameButton.onclick = newGame;
}

module.exports = {
  initialize: initialize
}