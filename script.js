const board = (function createBoard() { // IIEF for board
  const grid = (new Array(3)).fill(null).map( () => {return (new Array(3)).fill(null)}); // An array to store symbols
  
  // the idea is that the players symbol is used to add to the squares. This makes it more modular
  const addSymbol = function (r, c, player) { 
    //  0 <= x,y <= 2
    if (grid[r][c] != null) {
      console.log("something already here");
      return;
    }
    grid[r][c] = player.symbol;
  };

  // Will return an array of 3 coordinates ([row, column]) if a win is found, else nothing is returned
  const findWinFor = function (player) { // Use the players symbol to check if they won
    // check rows
    for (i = 0; i < 3; i++) {
      let winningRow = []
      for (j = 0; j < 3; j++) {
        if (grid[i][j] == player.symbol) { winningRow.push( [i, j] )};
      }
      if (winningRow.length == 3) {return winningRow};
    }

    // check columns
    for (i = 0; i < 3; i++) {
      let winningCol = []
      for (j = 0; j < 3; j++) {
        if (grid[j][i] == player.symbol) { winningCol.push( [i, j] )};
      }
      if (winningCol.length == 3) {return winningCol};
    }

    // check diagonal
    if ([[0,0], [1,1], [2,2]].every((coord) => {return grid[coord[0]][coord[1]] == player.symbol})) { return [[0,0], [1, 1], [2, 2]] };
    if ([[0,2], [1,1], [2,0]].every((coord) => {return grid[coord[0]][coord[1]] == player.symbol})) { return [[0,2], [1,1], [2,0]] };
    
    return null; // If nothing else is satisfied 
  };
  return { grid, addSymbol, findWinFor }

})();

function createPlayer(symbol) {
  let wins = 0;
  return { symbol, wins };
}

// game will switch the turns automatically
const game = (function() { // this will manage the turns and which player is going
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");
  let turns = 0;
  let winningCoords = null;  // supposed to change to true after someone wins
  let currentPlayer = player1;

  const putDownOn = function (r, c) {
    board.addSymbol(r, c, currentPlayer);
  };

  const checkForWinOrTie = function() {
      winningCoords = board.findWinFor(currentPlayer);
      if (winningCoords) {
      console.log(`${currentPlayer.symbol} wins!`);
      }

      if ((!winningCoords) && turns == 8){
        console.log("The game is a draw");
      }
  }

  const takeTurnOn = function (r, c) {
    if (turns >= 8 || winningCoords) { console.log("game is over")};
    putDownOn(r, c, currentPlayer);
    game_display.displayOnSquare([r, c], currentPlayer);
    checkForWinOrTie();
    currentPlayer = currentPlayer == player1 ? player2 : player1; // switching players
    turns++;
  }
  return { takeTurnOn }
})();

// Pass game into here so we can connect the display to the bts of the game
const game_display = (function () {
  // All initialization stuff
  const coordToSquare = new Map();

  const DOMGrid = document.querySelector(".game-grid"); 
  for (i = 0; i < 3; i++){
    for (j = 0; j < 3; j++){
      // Make the square node
      let square = document.createElement("div");
      square.classList.add("game-square");
      square.setAttribute("row", i);
      square.setAttribute("column", j);
      // The idea is when the square is clicked it calls take turn from the game class, 
      // To the coordinate the squares have their own attributes we can grab from
      // however this can only happens once
      square.addEventListener("click", () => {
        console.log(square.getAttribute("row"), square.getAttribute("column"));
        game.takeTurnOn(square.getAttribute("row"), square.getAttribute("column"));
      }, {once: true});

      // Add it to the appropriate data structures
      coordToSquare.set([i, j].toString(), square);
      DOMGrid.appendChild(square);
    }
  }

  const displayOnSquare = function(coord, player) {
    let square = coordToSquare.get(coord.toString());
    square.textContent = player.symbol;
  };

    return { displayOnSquare };
})();

