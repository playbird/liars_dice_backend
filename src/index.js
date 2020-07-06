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
  diceVal: 2,
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

function incrementDiceVal() {
  console.log('queef');
  let currentVal = latestBid.diceVal;
  if (currentVal == 0) {
    currentVal = currentVal + 3;
  } else if (currentVal == 6) {
    currentVal;
  } else {
    currentVal = currentVal +1;
  }
  latestBid.diceVal = currentVal;
  drawBid();
}

function decrementDiceVal() {
  let currentVal = latestBid.diceVal;
  if (currentVal == 2) {
    currentVal
  } else {
    currentVal = currentVal -1;
  }
  latestBid.diceVal = currentVal;
  drawBid();
}

function increaseDice() {
  let diceNo = latestBid.diceAmt;
  if (diceNo < gameState.diceTotal) {
    diceNo = diceNo +1;
  } else {
    diceNo;
  }
  latestBid.diceAmt = diceNo;
  drawBid();
}

function decreaseDice() {
  let diceNo = latestBid.diceAmt;
  if (diceNo == 1) {
    diceNo;
  } else {
    diceNo = diceNo -1;
  }
  latestBid.diceAmt = diceNo;
  drawBid();
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
    while (bidDiv.firstChild) {
      bidDiv.removeChild(bidDiv.firstChild);
    }
    let mainCont = doc.getElementById('main');
    let bidDiceVal = doc.createElement('div');
    bidDiceVal.className = 'bidDiceVal';
    let bidDiceAmt = doc.createElement('div');
    bidDiceAmt.className = 'bidDiceAmt';
    mainCont.appendChild(bidDiv);
    bidDiv.appendChild(bidDiceVal);
    bidDiv.appendChild(bidDiceAmt);
    let increaseDiceVal = doc.createElement('img');
    increaseDiceVal.setAttribute('src', '/images/' + 'uparrow.gif'); 
    increaseDiceVal.setAttribute('height', '16');
    increaseDiceVal.setAttribute('width', '32');
    increaseDiceVal.onclick = incrementDiceVal; 
    bidDiceVal.appendChild(increaseDiceVal);
    let br1 = doc.createElement('br');
    bidDiceVal.appendChild(br1); 

    let diceValue = doc.createElement('img');
    dVal = latestBid.diceVal;
    diceValue.setAttribute('src', '/images/' + dVal + '.gif');
    diceValue.setAttribute('height', '32');
    diceValue.setAttribute('width', '32');
    document.getElementById('bidengine');
    bidDiceVal.appendChild(diceValue);
    let br2 = doc.createElement('br');
    bidDiceVal.appendChild(br2);

    let decreaseDiceVal = doc.createElement('img');
    decreaseDiceVal.setAttribute('src', '/images/downarrow.gif'); 
    decreaseDiceVal.setAttribute('height', '16');
    decreaseDiceVal.setAttribute('width', '32');
    decreaseDiceVal.onclick = decrementDiceVal; 
    bidDiceVal.appendChild(decreaseDiceVal);
    let br3 = doc.createElement('br');
    bidDiceVal.appendChild(br3);

    let increaseDiceAmt = doc.createElement('img');
    increaseDiceAmt.setAttribute('src', '../images/uparrow.gif');  
    increaseDiceAmt.setAttribute('height', '16');
    increaseDiceAmt.setAttribute('width', '32');
    increaseDiceAmt.onclick = increaseDice; 
    bidDiceAmt.appendChild(increaseDiceAmt);
    let br4 = doc.createElement('br');
    bidDiceAmt.appendChild(br4);

    let diceBidDisplay = doc.createElement('p');
    let diceBidNumber = latestBid.diceAmt;
    diceBidNumber.toString();
    bidDiceAmt.appendChild(diceBidDisplay);
    diceBidDisplay.textContent = diceBidNumber;
    let br5 = doc.createElement('br');
    bidDiceAmt.appendChild(br5);

    let decreaseDiceAmt = doc.createElement('img');
    decreaseDiceAmt.setAttribute('src', '../images/downarrow.gif');  
    decreaseDiceAmt.setAttribute('height', '16');
    decreaseDiceAmt.setAttribute('width', '32');
    decreaseDiceAmt.onclick = decreaseDice
    bidDiceAmt.appendChild(decreaseDiceAmt);
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