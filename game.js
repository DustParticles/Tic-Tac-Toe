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
  let _isGameFinished = false;
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
    // Prevent user from marking grid when its robots turn
    /* _disableGrid(); */

    // find available Moves
    let availableMoves = _checkForAvailableMoves();

    // pick random move
    let randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];

    // mark grid with random move and append move to player
    let griddy = squares[randomMove];

    markGrid(griddy, randomMove, 0);

    if (!(player1.isRobot && player2.isRobot)) _enableGrid();
  }

  let resetGame = async () => {
    // Check if game is still in progress
    if (!_isGameFinished) return;

    // reset state
    _isGameFinished = false;

    // reset array grid
    player1.playerMoves = [];
    player2.playerMoves = [];

    // clear display grid
    squares.forEach((element) => {
      element.innerHTML = "";
    });

    // Check if both players are robots
    if (player1.isRobot && player2.isRobot) {
      _disableGrid();
      autoPlay();
    }

    // Check if it is robots turn
    else if (player1.isRobot && currentTurn == true) {
      _disableGrid();
      setTimeout(aiMode, 400);
    } else if (player2.isRobot && currentTurn == false) {
      _disableGrid();
      setTimeout(aiMode, 400);
    }

    // Make grid clickable
    else _enableGrid();
  };

  const _checkForAvailableMoves = () => {
    let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let movesUsed = [...player1.playerMoves, ...player2.playerMoves];

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
        _isGameFinished = true;
        _draws = 0;

        let winner = currentTurn ? player1 : player2;
        winner.wins++;
        alert(winner.name);

        _changeScoreboard(winner.wins);
        break;

      case _checkConsecutiveDraw():
        _disableGrid();
        _isGameFinished = true;

        alert(`${_draws} in a row draw!`);
        break;

      case _checkForDraw():
        _disableGrid();
        _isGameFinished = true;

        alert("Majority DRAW");
        break;
      default:
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
    if (playerButtonID == "player1") player1.isRobot = !player1.isRobot;
    else player2.isRobot = !player2.isRobot;
  };

  let toggleOverlay = () => {
    overlay.classList.toggle("close");
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let autoPlay = async () => {
    _disableGrid();

    if (_isGameFinished) {
      return;
    }
    await sleep(400);
    aiMode();
  };

  let _changeName = (person, displayName) => {
    person.name = "Billy";
    displayName.innerText = "Billy";
  };

  let startGame = () => {
    // Check if player1/player2 names are empty
    if (player1.name == undefined) {
      _changeName(player1, displayName1);
    }

    if (player2.name == undefined) {
      _changeName(player2, displayName2);
    }

    // If true change name

    // Toggle overlay
    toggleOverlay();

    // If game is over return
    if (_isGameFinished) {
      return;
    }

    // Check if player1 and player2 are bots
    // If so make them run continuously
    else if (player1.isRobot && player2.isRobot) {
      _disableGrid();
      autoPlay();
    }

    // Check if player1 and player2 is a bot
    // If so make call aiMode
    else if (player1.isRobot && currentTurn == true) {
      _disableGrid();
      setTimeout(aiMode, 400);
    } else if (player2.isRobot && currentTurn == false) {
      _disableGrid();
      setTimeout(aiMode, 400);
    }
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

  let markGrid = (grid, gridIndex, gridLength) => {
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

    // Display move
    grid.innerHTML = move;

    _checkIfSomeoneWon();
    _changeTurn();

    if (_isGameFinished) return;
    // Check if the next player will be a robot
    else if (player1.isRobot && currentTurn == true) {
      _disableGrid();

      setTimeout(aiMode, 400);
    } else if (player2.isRobot && currentTurn == false) {
      _disableGrid();
      setTimeout(aiMode, 400);
    }
  };

  // Listen to when player alters name
  nameInputs.forEach((nameInput) => {
    nameInput.addEventListener("change", () => {
      // Check if input value is empty
      nameInput.value = nameInput.value.trim() ? nameInput.value : "bob";

      // Change player name
      if (nameInput.id === "player-1") {
        player1.name = nameInput.value;
        displayName1.innerText = nameInput.value;
      } else {
        player2.name = nameInput.value;
        displayName2.innerText = nameInput.value;
      }
    });
  });

  return {
    markGrid,
    squares,
    resetButton,
    overlay,
    returnBackButton,
    resetGame,
    startGameButton,
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

gameboard.resetButton.addEventListener("click", gameboard.resetGame);

gameboard.returnBackButton.addEventListener("click", gameboard.toggleOverlay);

gameboard.startGameButton.addEventListener("click", gameboard.startGame);

/* [gameboard.karateIcon, gameboard.robotIcon].forEach((x) => {
  x.addEventListener("click", gameboard.toggleAiMode);
}); */

gameboard.playerModeButton1.forEach((x) => {
  x.addEventListener("click", gameboard.changePlayerMode);
});
