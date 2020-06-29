// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

let myID;
let gameState;
let displayName;
let isOver;
let latestBid = {
  player: '',
  diceVal: 0,
  diceAmt: 1
};

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

function bid() {
  axios.post('/bids')
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
  document.getElementById('bid').style.display = 'inline';
  document.getElementById('remove').style.display = 'inline';
  document.getElementById('newGame').style.display = 'none';
}

function showNewGameButton() {
  document.getElementById('reveal').style.display = 'none';
  document.getElementById('bid').style.display = 'none';
  document.getElementById('remove').style.display = 'none';
  document.getElementById('newGame').style.display = 'inline';
}

function update(userID) {
  getGame(userID).then(response => {
    gameState = response.data.game;
    observeState = response.data.game.observers;
    isOver = response.data.game.isOver;
    if (isOver) {
      showNewGameButton();
    } else {
      showPlayButtons();
    }
    drawGame(gameState, myID);
    drawObservers(observeState);
    setTimeout(update, 1500, myID);
  });
}

function initialize() {
  drawButtons();
  drawBid();
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
    if (i == 1) { 
        player.className = 'it';
        player.textContent = name + ":  ";
        let imageRoll = getImages(roll);
        for (let i = 0; i < imageRoll.length; i++) {
        diceValue = roll[i] + '.gif';
        let diceImg = doc.createElement('img');        
        diceImg.setAttribute('src', '/images/' + diceValue);
        diceImg.setAttribute('height', '32');
        diceImg.setAttribute('width', '32');
        document.getElementsByClassName('it');
        player.appendChild(diceImg);
        }
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
  
  function drawObservers(observeState) {
    let doc = window.document;
    let observerDiv = document.getElementById('observer');
    while (observerDiv.firstChild) {
      observerDiv.removeChild(observerDiv.firstChild);
    }
    for (let i = 0; i < observeState.length; i++) {
      let observer = doc.createElement('div');  
      let name = observeState[i].name;
      observer.className = 'observer';
      observer.textContent =  name + ":  is watching";
      observerDiv.appendChild(observer);
    }
  }
  
  function drawBid() {
    let doc = window.document;
    let bidDiv = doc.getElementById('bidengine');
    let mainCont = doc.getElementById('main');
    let bidDiceVal = doc.createElement('div');
    bidDiceVal.className = 'bidDiceVal';
    let bidDiceAmt = doc.createElement('div');
    bidDiceAmt.className = 'bidDiceAmt';
    mainCont.appendChild(bidDiv);
    bidDiv.appendChild(bidDiceVal);
    bidDiv.appendChild(bidDiceAmt);
    let increaseDiceNumber = doc.createElement('input');
    let decreaseDiceNumber = doc.createElement('input');
    let increaseDiceValue = doc.createElement('input');
    let decreaseDiceValue = doc.createElement('input');
    let diceValue = doc.createElement('img');
    dVal = latestBid.diceVal;
    increaseDiceNumber.setAttribute('type', 'image');
    increaseDiceNumber.setAttribute('src', '/images/' + 'uparrow.gif'); 
    increaseDiceNumber.setAttribute('height', '16');
    increaseDiceNumber.setAttribute('width', '32');

    bidDiceVal.appendChild(increaseDiceNumber);
    let br1 = doc.createElement('br');
    bidDiceVal.appendChild(br1);

    if (dVal == 0) {
      diceValue.setAttribute('src', '/images/2.gif'); 
      diceValue.setAttribute('height', '32');
      diceValue.setAttribute('width', '32');
      doc.getElementById('bidengine');
      bidDiceVal.appendChild(diceValue);
      let br2 = doc.createElement('br');
      bidDiceVal.appendChild(br2);
    } else {
      diceValue.setAttribute('src', '/images/' + dVal + '.gif');
      diceValue.setAttribute('height', '32');
      diceValue.setAttribute('width', '32');
      document.getElementsById('bidengine');
      bidDiceVal.appendChild(diceValue);
      let br2 = doc.createElement('br');
      bidDiceVal.appendChild(br2);
    }
    decreaseDiceNumber.setAttribute('type', 'image');
    decreaseDiceNumber.setAttribute('src', '/images/downarrow.gif'); 
    decreaseDiceNumber.setAttribute('height', '16');
    decreaseDiceNumber.setAttribute('width', '32');
    bidDiceVal.appendChild(decreaseDiceNumber);
    let br3 = doc.createElement('br');
    bidDiceVal.appendChild(br3);

    increaseDiceValue.setAttribute('type', 'image');
    increaseDiceValue.setAttribute('src', '../images/uparrow.gif');  
    increaseDiceValue.setAttribute('height', '16');
    increaseDiceValue.setAttribute('width', '32');
    bidDiceAmt.appendChild(increaseDiceValue);
    let br4 = doc.createElement('br');
    bidDiceAmt.appendChild(br4);
    let diceBidDisplay = doc.createElement('p');
    let diceBidNumber = latestBid.diceAmt;
    diceBidNumber.toString();
    bidDiceAmt.appendChild(diceBidDisplay);
    diceBidDisplay.textContent = diceBidNumber;
    let br5 = doc.createElement('br');
    bidDiceAmt.appendChild(br5);
    decreaseDiceValue.setAttribute('type', 'image');
    decreaseDiceValue.setAttribute('src', '../images/downarrow.gif');  
    decreaseDiceValue.setAttribute('height', '16');
    decreaseDiceValue.setAttribute('width', '32');
    bidDiceAmt.appendChild(decreaseDiceValue);
    bidDiceAmt.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
  }

  function drawButtons() {
  let doc = window.document;
  let bidButton = doc.createElement('button');
  doc.body.appendChild(bidButton);
  bidButton.id = 'bid';
  bidButton.textContent = " I Have Bid ";
  bidButton.href = "#";
  bidButton.onclick = bid;
  doc.body.appendChild( document.createTextNode( '\u00A0\u00A0' ) );

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