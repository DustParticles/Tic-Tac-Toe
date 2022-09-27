const gameboard = (function name(params) {
  let boardGriddy = [];
  let whoWon;
  let currentTurn = true;

  let _checkCurrentTurn = (grid) => {
    let move = currentTurn ? "X" : "O";
    currentTurn = !currentTurn;
    return move;
  };

  // if element length is not zero then it is not empty
  let _checkIfEmpty = (grid) => grid.childNodes.length;

  let markGrid = (grid) => {
    console.log(grid.target.closest(".square"));
    if (_checkIfEmpty(grid.target)) {
      console.log("already marked");
      return;
    }

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
