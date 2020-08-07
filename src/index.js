// This file is the root of the javascript that runs in the browser
// This gets transpiled into bundle.js
// Access this code via the variable name EntryPoint (ex: EntryPoint.getGame)

const axios = require('axios');

let myID;
let gameState;
let userAmt;
let displayName;
let isOver;
let previousBid = {
  player: '',
  diceVal: 0,
  diceAmt: 0
};
let latestBid = {
  player: '',
  diceVal: 2,
  diceAmt: 0
};

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

function createUser(displayName) {
  return axios.post('/users?displayName=' + displayName);
}

function reveal() {
  axios.delete('/users/dice')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  latestBid.diceAmt = 1;
  latestBid.diceVal = 2;
}

function bid() {
  axios.post('/bids', {
    latestBid: latestBid 
  })
  .then(function (response) {
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

function showPlayButtons(isIt) {
  if (isIt == false) {
    document.getElementById('reveal').style.visibility = 'hidden';
  } else {
    document.getElementById('reveal').style.visibility = 'visible';
  }
  document.getElementById('newGame').style.display = 'none';
}

function showNewGameButton() {
  document.getElementById('reveal').style.display = 'none';
  document.getElementById('newGame').style.display = 'inline';
}

function displayBidEngine(isIt) {
  if (isIt == false) {
    document.getElementById('bidengine').style.visibility = 'hidden';
  } else {
    document.getElementById('bidengine').style.visibility = 'visible';
  }
}

function update(userID) {
  getGame(userID).then(response => {
    gameState = response.data.game;
    observeState = response.data.game.observers;
    isOver = response.data.game.isOver;
    previousBid = response.data.game.previousBid;
    isIt = response.data.game.isIt;
    userAmt = response.data.game.users.length;
    if (isOver) {
      showNewGameButton();
    } else {
      showPlayButtons(isIt);
    }
    displayBidEngine(isIt);
    drawGame(gameState, myID);
    drawObservers(observeState)
    reDrawPreviousBid();
    setTimeout(update, 1000, myID);
  });
}

function reDrawPreviousBid() {
  let doc = window.document;
  
  let dA = previousBid.diceAmt;
  let diceBidDisplay = doc.getElementById('dicedisplay');
  diceBidDisplay.textContent = 'Bid: ' + dA; 

  let dV = previousBid.diceVal;
  let diceValue = doc.getElementById('biddiceface');
  diceValue.setAttribute('src', '/images/' + dV + '.gif');

  drawBid()
}

function initialize() {
  drawButtons();
  drawPreviousBid();
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

  function drawPreviousBid() {
    let doc = window.document;
    let pBidDiv = doc.getElementById('previousbid');
    while (pBidDiv.firstChild) {
      pBidDiv.removeChild(pBidDiv.firstChild);
    }
    let mainCont = doc.getElementById('main');
    let bidCont = doc.getElementById('bids');
    let pBidDiceVal = doc.createElement('div');
    let pBidDiceAmt = doc.createElement('div');
    pBidDiceVal.className = 'pBidDiceVal';
    pBidDiceAmt.className = 'pBidDiceAmt';
    mainCont.appendChild(bidCont);
    bidCont.appendChild(pBidDiv);
    pBidDiv.appendChild(pBidDiceAmt);
    pBidDiv.appendChild(pBidDiceVal);
    pDVal = previousBid.diceVal;

    let diceBidDisplay = doc.createElement('p');
    diceBidDisplay.setAttribute('id', 'dicedisplay');
    let diceBidNumber = previousBid.diceAmt;
    diceBidNumber.toString();
    pBidDiceAmt.appendChild(diceBidDisplay);
    diceBidDisplay.textContent = 'Bid: ' + diceBidNumber;

    let diceValue = doc.createElement('img');
    diceValue.setAttribute('id', 'biddiceface');
    diceValue.setAttribute('src', '/images/' + pDVal + '.gif');
    diceValue.setAttribute('height', '32');
    diceValue.setAttribute('width', '32');
    pBidDiceVal.appendChild(diceValue);

    let revealButton = doc.createElement('button');

    pBidDiv.appendChild(revealButton);
    revealButton.id = 'reveal';
    revealButton.textContent = " Liar! ";
    revealButton.href = "#";
    revealButton.onclick = reveal;
  }
  
  function drawBid() {
    let doc = window.document;
    let bidDiv = doc.getElementById('bidengine');
    while (bidDiv.firstChild) {
      bidDiv.removeChild(bidDiv.firstChild);
    }
      let mainCont = doc.getElementById('main');
      let bidCont = doc.getElementById('bids');
      let bidDiceVal = doc.createElement('div');
      bidDiceVal.className = 'bidDiceVal';
      let bidDiceAmt = doc.createElement('div');
      bidDiceAmt.className = 'bidDiceAmt';
      let bidBut = doc.createElement('div');
      mainCont.appendChild(bidCont);
      bidCont.appendChild(bidDiv);
      bidDiv.appendChild(bidDiceAmt);
      bidDiv.appendChild(bidDiceVal);
      bidDiv.appendChild(bidBut);

      createImage('/images/uparrow.gif', '16', '32', incrementDiceVal, bidDiceVal);
      let br1 = doc.createElement('br');
      bidDiceVal.appendChild(br1); 

      dVal = latestBid.diceVal;
      let diceValue = doc.createElement('img');
      diceValue.setAttribute('id', 'biddiceface');
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
      let diceBidV = latestBid.diceAmt;
      diceBidV.toString();
      bidDiceAmt.appendChild(diceBidDisplay);
      diceBidDisplay.textContent = diceBidV;
      let br5 = doc.createElement('br');
      bidDiceAmt.appendChild(br5);

      createImage('/images/downarrow.gif', '16', '32', decreaseDice, bidDiceAmt);
      
      let bidButton = doc.createElement('button');
      bidBut.appendChild(bidButton);
      bidButton.id = 'bid';
      bidButton.textContent = " Place Bid ";
      bidButton.href = "#";
      bidButton.onclick = bidBtn;

  }

  function validateBid() {
    if ((latestBid.diceAmt > previousBid.diceAmt) || ((latestBid.diceVal > previousBid.diceVal) && (latestBid.diceAmt >= previousBid.diceAmt))) {
      bid();
    } else {
      alert("Your bid is not valid. Try again.")
    }
  }
    
  function bidBtn() {
    validateBid();
  }

  function drawButtons() {
  let doc = window.document;
  
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