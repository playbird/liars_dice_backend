// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

let myID;
let gameState;
let displayName;

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function createUser(displayName) {
  return axios.post('/users?displayName=' + displayName);
}

function reRoll() {
  axios.post('/reroll')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
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

function update(userID) {
  getGame(userID).then(response => {
    gameState = response.data.game;
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

function drawGame(gameState, myID) {
  // step 1: find the element with the ID (div)
  // step 2: find its parent and store it
  // step 3: remove the tagged element
  // step 4: make a new one
  // step 5: add the new one to the old one's parent
  let doc = window.document;
  let gameDiv = document.getElementById('game');
  while (gameDiv.firstChild) {
    gameDiv.removeChild(gameDiv.firstChild);
  }
  let userCount = gameState.users.length;
  for (var i = 0; i < userCount; i++) {
    let roll = gameState.users[i].dice;
    let name = gameState.users[i].name;
    let newDiv = doc.createElement('div');
    newDiv.className = 'div' + i;
    gameDiv.appendChild(newDiv);
    newDiv.textContent = name + ":  " + roll;  
  }
}

function drawButtons() {
  let doc = window.document;
  let rerollButton = doc.createElement('button');
  doc.body.appendChild(rerollButton);
  rerollButton.textContent = "Re-roll";
  rerollButton.href = "#";
  rerollButton.onclick = reRoll;
  doc.body.appendChild( document.createTextNode( '\u00A0\u00A0' ) );

  let revealButton = doc.createElement('button');
  doc.body.appendChild(revealButton);
  revealButton.textContent = " Liar! ";
  revealButton.href = "#";
  revealButton.onclick = reveal;
  doc.body.appendChild( document.createTextNode( '\u00A0\u00A0' ) );

  let removeButton = doc.createElement('button');
  doc.body.appendChild(removeButton);
  removeButton.textContent = " Remove a dice ";
  removeButton.href = "#";
  removeButton.onclick = remove;
}

module.exports = {
  initialize: initialize
}