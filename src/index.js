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
  axios.post('/bids', {
    latestBid: latestBid 
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
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
  if (latestBid.diceVal == 0) {
    latestBid.diceVal = 3;
  } else if (latestBid.diceVal < 6) {
    latestBid.diceVal++;
  } 
  drawBid();
}

function decrementDiceVal() {
  if (latestBid.diceVal > 2) {
    latestBid.diceVal--;
  } 
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

function createImage(imagePath, height, width, onClickFunction, parent) {
  let image = window.document.createElement('img');
    image.setAttribute('src', imagePath); 
    image.setAttribute('height', height);
    image.setAttribute('width', width);
    image.onclick = onClickFunction; 
    parent.appendChild(image);
    return image;
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

    createImage('/images/uparrow.gif', '16', '32', incrementDiceVal, bidDiceVal);
    let br1 = doc.createElement('br');
    bidDiceVal.appendChild(br1); 

    dVal = latestBid.diceVal;
    let diceValue = doc.createElement('img');
    diceValue.setAttribute('src', '/images/' + dVal + '.gif');
    diceValue.setAttribute('height', '32');
    diceValue.setAttribute('width', '32');
    document.getElementById('bidengine');
    bidDiceVal.appendChild(diceValue);
    let br2 = doc.createElement('br');
    bidDiceVal.appendChild(br2);

    createImage('/images/downarrow.gif', '16', '32', decrementDiceVal, bidDiceVal);
    let br3 = doc.createElement('br');
    bidDiceVal.appendChild(br3);

    createImage('/images/uparrow.gif', '16', '32', increaseDice, bidDiceAmt);
    let br4 = doc.createElement('br');
    bidDiceAmt.appendChild(br4);

    let diceBidDisplay = doc.createElement('p');
    let diceBidNumber = latestBid.diceAmt;
    diceBidNumber.toString();
    bidDiceAmt.appendChild(diceBidDisplay);
    diceBidDisplay.textContent = diceBidNumber;
    let br5 = doc.createElement('br');
    bidDiceAmt.appendChild(br5);

    createImage('/images/downarrow.gif', '16', '32', decreaseDice, bidDiceAmt);
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