const Player = function players() {
  let name;
  let wins = 0;
  let isRobot = false;
  let playerMoves = [];
  return { playerMoves, name, wins, isRobot };
};

const gameboard = (function name(params) {
  let player1 = Player();
  let player2 = Player();
  let _draws = 0;
  let _isGridClickable = true;
  let _winStatus = true;
  const _allPossibleWinningMoves = {
    0: [0, 1, 2],
    1: [3, 4, 5],
    2: [6, 7, 8],
    3: [0, 3, 6],
    4: [1, 4, 7],
    5: [2, 5, 8],
    6: [0, 4, 8],
    7: [2, 4, 6],
  };

  let currentTurn = true;
  // elements
  const squares = document.querySelectorAll(".square");
  const overlay = document.querySelector(".overlay");

  const karateIconPlayer1 = document.querySelector(".toggle-human-mode-1");
  const robotIconPlayer1 = document.querySelector(".toggle-ai-mode-1");

  const karateIconPlayer2 = document.querySelector(".toggle-human-mode-2");
  const robotIconPlayer2 = document.querySelector(".toggle-ai-mode-2");

  const displayName1 = document.querySelector(".player-1-name");
  const displayName2 = document.querySelector(".player-2-name");

  const playerModeButton1 = document.querySelectorAll("[data-player]");

  const scoreboard = {
    scoreOne: document.querySelector(".player-score-one"),
    scoreTwo: document.querySelector(".player-score-two"),
  };

  // buttons
  const resetButton = document.querySelector(".reset-button");
  const returnBackButton = document.querySelector(".go-back-overlay");
  const nameInputs = document.querySelectorAll(".change-name-input");
  const startGameButton = document.querySelector(".start-game");

  function aiMode() {
    // find available Moves
    let availableMoves = _checkForAvailableMoves();

    // pick random move
    let randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];

    // mark grid with random move and append move to player
    let griddy = squares[randomMove];

    markGrid(griddy, randomMove, 0);
  }

  let resetGame = () => {
    // clear display grid
    squares.forEach((element) => {
      element.innerHTML = "";
    });

    // reset array grid
    player1.playerMoves = [];
    player2.playerMoves = [];

    // reset state
    _winStatus = true;

    // Make grid clickable
    _enableGrid();

    // Check if it is robots turn
    if (player1.isRobot && currentTurn == true) {
      aiMode();
    } else if (player2.isRobot && currentTurn == false) {
      aiMode();
    }
    // Check if both players are robots
    else if (player1.isRobot && player2.isRobot) {
      autoPlay();
    }
  };

  const _checkForAvailableMoves = () => {
    let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let movesUsed = [...player1.playerMoves, ...player2.playerMoves];
    console.log(movesUsed);
    for (const item of movesUsed) {
      let itemPosition = availableMoves.indexOf(item);
      availableMoves.splice(itemPosition, 1);
    }

    return availableMoves;
  };

  let _checkCurrentTurn = () => {
    const nintendo = "X";
    const ps4 = "O";

    const move = currentTurn ? nintendo : ps4;
    return move;
  };

  const _changeTurn = () => (currentTurn = !currentTurn);

  const _changeScoreboard = (winner) => {
    let scoreboardElement = currentTurn
      ? scoreboard.scoreOne
      : scoreboard.scoreTwo;
    scoreboardElement.innerText = winner;
  };

  let _checkIfSomeoneWon = () => {
    switch (true) {
      case _checkIfInside(player1.playerMoves):
      case _checkIfInside(player2.playerMoves):
        _disableGrid();
        _draws = 0;
        let winner = currentTurn ? player1 : player2;
        alert(winner.name);
        winner.wins++;
        _changeScoreboard(winner.wins);
        _winStatus = !_winStatus;
        console.log("it is in fact true i did flabberdaeus");
        break;

      case _checkConsecutiveDraw():
        alert(`${_draws} in a row draw!`);
        _winStatus = !_winStatus;
        break;

      case _checkForDraw():
        _disableGrid();
        alert("Majority DRAW");
        _winStatus = !_winStatus;
        break;
      default:
        console.log("it is in fact false i did flabberastronomically");
    }
  };

  let _checkIfInside = (playerMoves) => {
    // make sure player has marked at least 3 times
    if (playerMoves.length < 3) return false;

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

  let _checkForDraw = () => {
    let totalMovesMade =
      player1.playerMoves.length + player2.playerMoves.length;
    return totalMovesMade >= 9;
  };

  let _checkConsecutiveDraw = () => {
    let drawResults = _checkForDraw();
    if (drawResults) _draws++;

    return _draws >= 3 && drawResults;
  };

  let changePlayerMode = (x) => {
    // Check which button to change status
    toggleAiMode(x.target.classList);

    let playerButtonID = x.target.getAttribute("data-player");

    // Change player state
    if (playerButtonID == "player1") {
      console.log("plyer1 change");
      player1.isRobot = !player1.isRobot;
    } else {
      console.log("plyer2 change");
      player2.isRobot = !player2.isRobot;
    }
  };

  let toggleOverlay = () => {
    overlay.classList.toggle("close");
  };

  let autoPlay = () => {
    if (!_winStatus) {
      return;
    }
    while (_winStatus) {
      aiMode();
    }
  };

  // when player clicks start ai will make move
  let startGame = () => {
    // Toggle overlay
    toggleOverlay();

    // check if player1 and player2 are bots
    // if so make them run continuously
    if (player1.isRobot && player2.isRobot && !_winStatus) {
      autoPlay();
    }

    // check if player1 and player2 is a bot
    // if so make call aiMode
    else if (player1.isRobot && _isGridClickable && currentTurn == true) {
      aiMode();
    } else if (player2.isRobot && _isGridClickable && currentTurn == false) {
      aiMode();
    }

    // prevent user from making a move when it is the bots turn
  };

  let toggleAiMode = (button) => {
    // change button visibility
    if (button == "toggle-human-mode-1" || button == "toggle-ai-mode-1") {
      karateIconPlayer1.classList.toggle("close");
      robotIconPlayer1.classList.toggle("close");
    } else {
      karateIconPlayer2.classList.toggle("close");
      robotIconPlayer2.classList.toggle("close");
    }
  };

  let _disableGrid = () => {
    _isGridClickable = false;
    let increment = 0;
    while (increment < squares.length) {
      squares[increment].setAttribute("disabled", "disabled");
      ++increment;
    }
  };

  let _enableGrid = () => {
    _isGridClickable = true;
    let increment = 0;
    while (increment < squares.length) {
      squares[increment].removeAttribute("disabled");
      ++increment;
    }
  };

  let markGrid = (grid, gridIndex, gridLength) => {
    console.log(typeof grid);
    console.log(grid);
    if (gridLength) {
      console.log("already marked");

      return;
    }

    const move = _checkCurrentTurn(grid);

    // append moves to array
    if (currentTurn) {
      player1.playerMoves.push(+gridIndex);
    } else {
      player2.playerMoves.push(+gridIndex);
    }

    // display
    grid.innerHTML = move;

    _checkIfSomeoneWon();
    _changeTurn();

    // check if the next player will be a robot
    // if so then automatically call the aiMode
    if (!_winStatus) {
      return;
    }
    if (player1.isRobot && currentTurn == true) {
      aiMode();
    } else if (player2.isRobot && currentTurn == false) {
      aiMode();
    }
  };

  return {
    robotIcon: robotIconPlayer1,
    karateIcon: karateIconPlayer1,
    markGrid,
    squares,
    resetButton,
    overlay,
    nameInputs,
    returnBackButton,
    resetGame,
    startGameButton,
    player1,
    player2,
    displayName1,
    displayName2,
    toggleOverlay,
    toggleAiMode,
    changePlayerMode,

    _checkForDraw,
    _checkForAvailableMoves,
    aiMode,
    startGame,

    playerModeButton1,
  };
})();

// listen for when clicked
gameboard.squares.forEach((square) =>
  square.addEventListener("click", (grid) => {
    let gridTarget = grid.target;
    let gridLength = gridTarget.childNodes.length;
    let gridIndex = gridTarget.getAttribute("data-grid-button");
    gameboard.markGrid(gridTarget, gridIndex, gridLength);
  })
);

/* REMEMBER TO PUT THIS IN GAME BOARD INSTEAD OF OUTSIDE FOR SECURITY? */
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

gameboard.returnBackButton.addEventListener("click", gameboard.toggleOverlay);

gameboard.startGameButton.addEventListener("click", gameboard.startGame);

/* [gameboard.karateIcon, gameboard.robotIcon].forEach((x) => {
  x.addEventListener("click", gameboard.toggleAiMode);
}); */

gameboard.playerModeButton1.forEach((x) => {
  x.addEventListener("click", gameboard.changePlayerMode);
});
