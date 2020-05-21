// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function drawGame(document, gameState, myID) {
  // step 1: find the element with the ID (div)
  // step 2: find its parent and store it
  // step 3: remove the tagged element
  // step 4: make a new one
  // step 5: add the new one to the old one's parent
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  let userCount = gameState.users.length;
  for (var i = 0; i < userCount; i++) {
    let player = gameState.users[i].id;
    let roll = gameState.users[i].dice;
    let name = gameState.users[i].name;
    let newDiv = document.createElement('div');
    newDiv.className = 'div' + i;
    document.body.appendChild(newDiv);
    newDiv.textContent = player;
  }
  let rerollButton = window.document.createElement('a');
  document.body.appendChild(rerollButton);
  rerollButton.textContent = "Re-roll";
  rerollButton.href = "#";
  rerollButton.onclick = reRoll;
}

module.exports = {
  getGame: getGame,
  drawGame: drawGame
}