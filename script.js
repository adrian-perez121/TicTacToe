const board = (function createBoard() { // IIEF for board
  const grid = (new Array(3)).fill(null).map( () => {return (new Array(3)).fill(null)}); // An array to store symbols
  
  // the idea is that the players symbol is used to add to the squares. This makes it more modular
  const addSymbol = function (r, c, player) { 
    //  0 <= x,y <= 2
    grid[r][c] = player.symbol;
    
  };
  return { grid, addSymbol }

})();

function createPlayer(symbol) {
  let wins = 0;
  return { symbol, wins };
}

let testPlayer = createPlayer("X");
board.addSymbol(1,1,testPlayer);
console.log(board.grid);
