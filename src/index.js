// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function drawGame(document, gameState, myID) {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  let playerRow = document.createElement('P');
  playerRow.textContent = JSON.stringify(gameState);
  document.body.appendChild(playerRow);
}

module.exports = {
  getGame: getGame,
  drawGame: drawGame
}
