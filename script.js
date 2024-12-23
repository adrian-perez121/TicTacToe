const board = (function createBoard() { // IIEF for board
  const grid = (new Array(3)).fill(null).map( () => {return (new Array(3)).fill(null)}); // An array to store symbols
  
  // the idea is that the players symbol is used to add to the squares. This makes it more modular
  const addSymbol = function (r, c, player) { 
    //  0 <= x,y <= 2
    if (grid[r][c] != null) {
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

  const resetGrid = function () {
    grid.forEach((row) => row.fill(null));
  };
  return { grid, addSymbol, findWinFor, resetGrid }

})();

function createPlayer(symbol) {
  let name = symbol // by default the name of the player is the symbol
  let wins = 0;
  return { symbol, wins, name };
}

// game will switch the turns automatically
const game = (function() { // this will manage the turns and which player is going
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");
  let turns = 0;
  let winner = null;
  let phase = 'inProgress';
  let winningCoords = null;  // supposed to change to true after someone wins
  let currentPlayer = player1;

  const putDownOn = function (r, c) {
    board.addSymbol(r, c, currentPlayer);
  };

  const checkForWinOrTie = function() {
      winningCoords = board.findWinFor(currentPlayer);
      if (winningCoords) {
        currentPlayer.wins++;
        winner = currentPlayer;
        phase = `win`
      }

      if ((!winningCoords) && turns == 8){
        phase = 'draw'
      }
  }

  const getCurrentPlayer = function() {
    return currentPlayer;
  }

  const takeTurnOn = function (r, c) {
    if (turns >= 8 || winningCoords) { console.log("game is over")}; 
    putDownOn(r, c, currentPlayer);
    checkForWinOrTie();

    currentPlayer = currentPlayer == player1 ? player2 : player1; // switching players
    turns++;
  }

  const inPhase = function () {
    return phase;
  }

  const resetGame = function () {
    turns = 0;
    phase = 'inProgress';
    winningCoords = null;  // supposed to change to true after someone wins
    currentPlayer = player1;
  };

  const getPlayer1 = function() { return player1 };
  const getPlayer2 = function() { return player2 };
  const getWinner = function() { return winner };

  return { takeTurnOn, getCurrentPlayer, inPhase, resetGame, getPlayer1, getPlayer2, getWinner }
})();

// A controller for controller for the player names, wins and messages
const gameInfoController = (function () {
  const player1NameBox = document.querySelector(".player1-info");
  const player2NameBox = document.querySelector(".player2-info");
  const messageBox = document.querySelector(".game-message");

  const updateBothPlayers = function(player1, player2) {
    player2NameBox.textContent = `${player2.wins} - ${player2.name}`
    player1NameBox.textContent = `${player1.name} - ${player1.wins}`;
   }

  const setMessage = function(message) {
    messageBox.textContent = message;
  }

  return { updateBothPlayers, setMessage };
})();

// Pass game into here so we can connect the display to the bts of the game
const game_display = (function () {
  // All initialization stuff
  const coordToSquare = new Map();

  
  const displayOnSquare = function(coord, player) {
    let square = coordToSquare.get(coord.toString());
    square.textContent = player.symbol;
  };
  
  const DOMGrid = document.querySelector(".game-grid");
  
  function createDisplay() {
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
  
          let row = square.getAttribute("row");
          let column = square.getAttribute("column");
          if (game.inPhase() == 'inProgress' ) {
            displayOnSquare([row, column], game.getCurrentPlayer());
            game.takeTurnOn(row, column);
            console.log(game.inPhase());

            // If the game ends after this turn update the displays
            if (game.inPhase() == 'win') {
              gameInfoController.setMessage(`${game.getWinner().name} is the winner!`)
              gameInfoController.updateBothPlayers(game.getPlayer1(), game.getPlayer2());
            } else if (game.inPhase() == 'draw') {
              gameInfoController.setMessage("This game is a draw, no one wins.")
            }
          }
        }, {once: true});
  
        // Add it to the appropriate data structures
        coordToSquare.set([i, j].toString(), square);
        DOMGrid.appendChild(square);
      }
    }

    // Setting up the stats
    gameInfoController.updateBothPlayers(game.getPlayer1(), game.getPlayer2());
  }

  createDisplay();
  

  const resetDisplay = function () {
    DOMGrid.innerHTML = "";
    createDisplay();
  }
    return { displayOnSquare, resetDisplay };
})();

const resetButton = document.querySelector(".reset-btn")
resetButton.addEventListener("click", ()=>{
  game_display.resetDisplay();
  board.resetGrid();
  game.resetGame();
  gameInfoController.setMessage(""); 
  
})
