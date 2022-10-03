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
  let _clearGriddy = () => {
    // clear display grid
    squares.forEach((element) => {
      element.innerHTML = "";
    });

    console.log("are you okay bruh?");
    // reset array grid
  };

  let _checkCurrentTurn = (grid) => {
    const nintendo = "X";
    const ps4 = "O";

    let move = currentTurn ? nintendo : ps4;
    return move;
  };

  const _changeTurn = () => (currentTurn = !currentTurn);

  let _checkIfSomeoneWon = () => {
    /* weird way of doing kind weirdchampionship // player1.playerMoves.sort((a, b) => a - b);
    // player2.playerMoves.sort((a, b) => a - b);
    // for (const key in _allPossibleWinningMoves) {
    //   let winCondition = _allPossibleWinningMoves[key].join();
    //   if (winCondition === player1.playerMoves.join()) return true;
    // } */

    console.log(_checkIfInside(player1.playerMoves));

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

    for (
      let index = 0;
      index < Object.keys(_allPossibleWinningMoves).length;
      index++
    ) {
      const winningNumbers = _allPossibleWinningMoves[index];

      let checkIfMatches = playerMoves.every((number) => {
        return winningNumbers.includes(number);
      });

      if (checkIfMatches) {
        return true;
      }
    }
  };

  // use an object to store possible indexes that would win - done

  // get players index moves  - done?

  // and then compare that to the objects possible ways to win

  // if element length is not zero then it is not empty
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
    _clearGriddy,
    _checkIfSomeoneWon,
    player1,
    player2,
  };
})();

// listen for when clicked
gameboard.squares.forEach((element) =>
  element.addEventListener("click", gameboard.markGrid)
);
