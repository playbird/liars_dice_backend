// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

let myID;
let gameState;

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function update(userID) {
  getGame(userID).then(response => {
    myID = response.data.me;
    gameState = response.data.game;
    drawGame(gameState, myID);
    console.log("User ID is: " + userID);
    console.log("My ID is: " + myID);
    setTimeout(update, 10000, myID);
  });
}

function initialize() {
  update('new');
}

function drawGame(gameState, myID) {
  // step 1: find the element with the ID (div)
  // step 2: find its parent and store it
  // step 3: remove the tagged element
  // step 4: make a new one
  // step 5: add the new one to the old one's parent
  let doc = window.document;
  while (doc.body.firstChild) {
    doc.body.removeChild(doc.body.firstChild);
  }
  let userCount = gameState.users.length;
  for (var i = 0; i < userCount; i++) {
    let roll = gameState.users[i].dice;
    let name = gameState.users[i].name;
    let newDiv = doc.createElement('div');
    newDiv.className = 'div' + i;
    doc.body.appendChild(newDiv);
    newDiv.textContent = name + ":  " + roll;  
  }
  let rerollButton = doc.createElement('a');
  doc.body.appendChild(rerollButton);
  rerollButton.textContent = "Re-roll";
  rerollButton.href = "#";
  rerollButton.onclick = reRoll;
}

function reRoll() {
  console.log("Listen to the new Queef record!")
}

module.exports = {
  initialize: initialize
}