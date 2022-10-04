const player = function players(params) {
  let name;
  let playerMoves = [];
  return { playerMoves };
};

const gameboard = (function name(params) {
  let player1 = player();
  let player2 = player();
  const _allPossibleWinningMoves = {
    0: [1, 2, 3],
    1: [4, 5, 6],
    2: [7, 8, 9],
    3: [1, 4, 7],
    4: [2, 5, 8],
    5: [3, 6, 9],
    6: [1, 5, 9],
    7: [3, 5, 7],
  };
  let whoWon;
  let currentTurn = true;
  const squares = document.querySelectorAll(".square");
  const resetButton = document.querySelector(".reset-button");
  let resetGame = () => {
    // clear display grid
    squares.forEach((element) => {
      element.innerHTML = "";
    });

    // reset array grid
    player1.playerMoves = [];
    player2.playerMoves = [];
  };

  let _checkCurrentTurn = (grid) => {
    const nintendo = "X";
    const ps4 = "O";

    let move = currentTurn ? nintendo : ps4;
    return move;
  };

  const _changeTurn = () => (currentTurn = !currentTurn);

  let _checkIfSomeoneWon = () => {
    switch (true) {
      case _checkIfInside(player1.playerMoves):
      case _checkIfInside(player2.playerMoves):
        console.log("it is in fact true i did flabberdaeus");
        break;
      default:
        console.log(
          console.log("it is in fact false i did flabberastronomically")
        );
    }
  };

  let _checkIfInside = (playerMoves) => {
    // make sure player has marked atleast 3 times
    if (playerMoves < 3) return false;

    // iterate through all possible win conditions
    for (
      let index = 0;
      index < Object.keys(_allPossibleWinningMoves).length;
      index++
    ) {
      const winningNumbers = _allPossibleWinningMoves[index];

      let checkIfMatches = winningNumbers.every((number) => {
        return playerMoves.includes(number);
      });

      // stop when someone wins
      if (checkIfMatches) return true;
    }
  };

  let _checkIfEmpty = (grid) => grid.childNodes.length;

  let markGrid = (grid) => {
    if (_checkIfEmpty(grid.target)) {
      console.log("already marked");
      return;
    }

    const move = _checkCurrentTurn(grid);
    const gridIndex = +grid.target
      .closest(".square")
      .getAttribute("data-grid-button");

    // append moves to array
    if (currentTurn) {
      player1.playerMoves.push(gridIndex);
    } else {
      player2.playerMoves.push(gridIndex);
    }

    // display
    grid.target.innerHTML = move;

    _changeTurn();
  };

  return {
    markGrid,
    squares,
    resetButton,
    resetGame,
    _checkIfSomeoneWon,
    player1,
    player2,
  };
})();

// listen for when clicked
gameboard.squares.forEach((element) =>
  element.addEventListener("click", gameboard.markGrid)
);

gameboard.resetButton.addEventListener("click", gameboard.resetGame);
