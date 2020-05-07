// This file is the root of the javascript that runs in the browser

const axios = require('axios');
let userID;

// returns a Promise
function getGame(userID) {
  return axios.get('/games?userID=' + userID);
}

module.exports = {
  getGame
}
