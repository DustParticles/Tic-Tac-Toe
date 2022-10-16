const player = function players(params) {
  let name;
  let playerMoves = [];
  return { playerMoves, name };
};

const gameboard = (function name(params) {
  let player1 = player();
  let player2 = player();
  let displayName1 = document.querySelector(".player-1-name");
  let displayName2 = document.querySelector(".player-2-name");
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
  // elements
  const squares = document.querySelectorAll(".square");
  const overlay = document.querySelector(".overlay");

  // buttons
  const resetButton = document.querySelector(".reset-button");
  const nameInputs = document.querySelectorAll(".change-name-input");
  const startGameButton = document.querySelector(".start-game");
  let resetGame = () => {
    // clear display grid
    squares.forEach((element) => {
      element.innerHTML = "";
    });

    // reset array grid
    player1.playerMoves = [];
    player2.playerMoves = [];

    // Make grid clickable
    _enableGrid();
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
        let winner = _checkCurrentTurn ? player1.name : player2.name;
        alert(winner);
        _disableGrid();
        console.log("it is in fact true i did flabberdaeus");
        break;
      default:
        console.log("it is in fact false i did flabberastronomically");
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

  let _disableGrid = () => {
    let increment = 0;
    while (increment < squares.length) {
      squares[increment].setAttribute("disabled", "disabled");
      ++increment;
    }
  };

  let _enableGrid = () => {
    let increment = 0;
    while (increment < squares.length) {
      squares[increment].removeAttribute("disabled");
      ++increment;
    }
  };

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

    _checkIfSomeoneWon();
    _changeTurn();
  };

  return {
    markGrid,
    squares,
    resetButton,
    overlay,
    nameInputs,
    resetGame,
    startGameButton,
    player1,
    player2,
    displayName1,
    displayName2,
  };
})();

// listen for when clicked
gameboard.squares.forEach((square) =>
  square.addEventListener("click", gameboard.markGrid)
);

// listen to when player alters name
gameboard.nameInputs.forEach((nameInput) => {
  nameInput.addEventListener("change", (event) => {
    // check if input value is empty
    nameInput.value = nameInput.value.trim() ? nameInput.value : "bob";

    if (nameInput.id === "player-1") {
      console.log(nameInput.value, "player 1 chang");
      gameboard.player1.name = nameInput.value;
      gameboard.displayName1.innerText = nameInput.value;
    } else {
      console.log("player 2 chainge");
      gameboard.player2.name = nameInput.value;
      gameboard.displayName2.innerText = nameInput.value;
    }
  });
});

gameboard.resetButton.addEventListener("click", gameboard.resetGame);

gameboard.startGameButton.addEventListener("click", () => {
  let joe = document.querySelector(".change-name-input").value;

  gameboard.overlay.classList.add("overlay-close");
  if (joe.includes("﷽")) alert("ur adoptred");
});
