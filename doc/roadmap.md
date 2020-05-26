- [ ] Any player can trigger a reroll that resets everyone's dice
  - [ ] There is a "Reroll" button on every player's screen
      https://github.com/playbird/liars_dice_backend/blob/master/src/index.js#L59-L62
  - [ ] When a player hits the "Reroll" button it calls a local reroll() function
      https://github.com/playbird/liars_dice_backend/blob/master/src/index.js#L63
      https://github.com/playbird/liars_dice_backend/blob/9cf913e828b9854c9236ca5a579e1531e57464bc/src/index.js#L15
  - [ ] The local reroll function makes a POST request to the server's `/rolls` endpoint
      https://github.com/playbird/liars_dice_backend/blob/9cf913e828b9854c9236ca5a579e1531e57464bc/src/index.js#L16-L22
  - [ ] The server has a `/rolls` endpoint that calls a rerollHandler() function
      https://github.com/playbird/liars_dice_backend/blob/9cf913e828b9854c9236ca5a579e1531e57464bc/server.js#L89
      https://github.com/playbird/liars_dice_backend/blob/9cf913e828b9854c9236ca5a579e1531e57464bc/server.js#L76
  - [ ] The reroll function assigns each player a new number for each of their dice
      https://github.com/playbird/liars_dice_backend/blob/9cf913e828b9854c9236ca5a579e1531e57464bc/server.js#L77-L79

************ First playable ************

- [ ] Any player can end the bidding phase of game play and expose all players' dice
  - [ ] There is a button on every player's screen
  - [ ] When a player hits this button a local "reveal()" function gets called
  - [ ] The local `reveal()` function makes a PUT request to the `users/dice` endpoint
  - [ ] The server has a `/users/dice` endpoint that calls a function
  - [ ] This function sets a `revealed` boolean value in the game object
  - [ ] getGameForUser() checks the value of this boolean and shows all dice values if `revealed` is true

- [ ] Any player can remove one of their own dice
  - [ ] The `reroll` button is renamed, and it's clear that it'll remove a die from whomever presses it.
  - [ ] When this button is clicked a local function is called (proably `reroll()` renamed to something more accurate).
  - [ ] This local function makes a PUT call to the server's `/users/dice` endpoint with this user's ID and the new
      dice count in the query string.
  - [ ] The server has an endpoint `/users/dice` that takes a UserID and dice count

************ MVP ************
