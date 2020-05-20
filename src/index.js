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
  // step 2: gind its parent and store it
  // step 3: remove the tagged element
  // step 4: make a new one
  // step 5: add the new one to the old one's parent
  
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  title = document.createElement('h1');
  title.textContent = "Liar's Dice";
  document.body.appendChild(title);
  playerRow = document.createElement('h2');
  playerRow.textContent = JSON.stringify(gameState);
  document.body.appendChild(playerRow); 
  }

module.exports = {
  getGame: getGame,
  drawGame: drawGame
}
