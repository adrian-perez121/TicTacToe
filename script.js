const board = (function createBoard() { // IIEF for board
  const grid = (new Array(3)).fill(null).map( () => {return (new Array(3)).fill(null)}); // An array to store symbols
  
  // the idea is that the players symbol is used to add to the squares. This makes it more modular
  const addSymbol = function (r, c, player) { 
    //  0 <= x,y <= 2
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

