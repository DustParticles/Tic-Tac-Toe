const gameboard = (function name(params) {
  let boardGriddy = [];
  let whoWon;
  let currentTurn = true;
  let _checkCurrentTurn = (grid) => {
    let move = currentTurn
      ? (grid.target.innerHTML = "X")
      : (grid.target.innerHTML = "O");
    currentTurn = !currentTurn;
    return move;
  };

  let markGrid = (grid) => {
    /* let square = _checkCurrentTurn(grid); */
    console.log(grid.target.closest(".square"));

    grid.target.innerHTML = _checkCurrentTurn(grid);
  };

  return { boardGriddy, markGrid };
})();

const players = (function players(params) {
  let playerOne;
  let playerTwo;
  let playerOneMoves = [];
  let playerTwoMoves = [];
  return { playerOne, playerTwo };
})();

const squares = document.querySelectorAll(".square");
squares.forEach((element) =>
  element.addEventListener("click", gameboard.markGrid)
);
