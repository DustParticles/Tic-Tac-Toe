import names from "./names.json" assert { type: "json" };
console.log(names);
const Player = function players() {
  let name;
  let wins = 0;
  let isRobot = false;
  let playerMoves = [];
  return { playerMoves, name, wins, isRobot };
};

const nodeElements = (function () {
  const squares = document.querySelectorAll(".square");
  const overlay = document.querySelector(".overlay");
  const popup = document.querySelector(".popup");
  const popupWinner = document.querySelector(".winner-name");
  const popupWinStatus = document.querySelector(".popup-win-status");

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

  const popupCloseButton = document.querySelectorAll(".popup-close-button");
  const resetButton = document.querySelectorAll(".reset-button");
  const returnBackButton = document.querySelector(".go-back-overlay");
  const nameInputs = document.querySelectorAll(".change-name-input");
  const startGameButton = document.querySelector(".start-game");
  return {
    squares,
    overlay,
    popup,
    popupWinner,
    popupWinStatus,
    karateIconPlayer1,
    robotIconPlayer1,
    karateIconPlayer2,
    robotIconPlayer2,
    displayName1,
    displayName2,
    playerModeButton1,
    scoreboard,
    popupCloseButton,
    resetButton,
    returnBackButton,
    nameInputs,
    startGameButton,
  };
})();

const gameboard = (function name(params) {
  let _draws = 0;
  let _isGameFinished = false;
  let currentTurn = true;

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

  let player1 = Player();
  let player2 = Player();

  function aiMode() {
    // find available Moves
    let availableMoves = _checkForAvailableMoves();

    // pick random move
    let randomMove = availableMoves[_randomNumber(availableMoves.length)];

    // mark grid with random move and append move to player
    let griddy = nodeElements.squares[randomMove];

    markGrid(griddy, randomMove, 0);

    if (!(player1.isRobot && player2.isRobot)) _enableGrid();
  }

  let resetGame = async () => {
    // Check if game is still in progress
    if (!_isGameFinished) return;

    // Reset state
    _isGameFinished = false;

    // Reset array grid
    player1.playerMoves = [];
    player2.playerMoves = [];

    // Clear display grid
    nodeElements.squares.forEach((element) => {
      element.innerHTML = "";
    });

    // Check if it is robots turn
    switch (true) {
      // Run if both players are robots
      case player1.isRobot && player2.isRobot:
        _disableGrid();
        autoPlay();
        break;

      case player1.isRobot && currentTurn == true:
      case player2.isRobot && currentTurn == false:
        _disableGrid();
        setTimeout(aiMode, 400);
        break;

      default:
        _enableGrid();
        break;
    }
  };

  const _checkForAvailableMoves = () => {
    let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let movesUsed = [...player1.playerMoves, ...player2.playerMoves];

    // Remove numbers from availableMoves that have already been made
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
      ? nodeElements.scoreboard.scoreOne
      : nodeElements.scoreboard.scoreTwo;
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
        _alertWinner(winner.name, "WINS");
        _changeScoreboard(winner.wins);
        break;

      case _checkConsecutiveDraw():
        _disableGrid();
        _isGameFinished = true;

        _alertWinner(`${_draws} in a row`, "DRAW");
        break;

      case _checkForDraw():
        _disableGrid();
        _isGameFinished = true;

        _alertWinner("Majority", "DRAW");
        break;
      default:
    }
  };

  let _alertWinner = (nameOfWinner, winStatus) => {
    nodeElements.popupWinner.innerText = `${nameOfWinner}`;
    nodeElements.popupWinStatus.innerText = winStatus;

    // Alert Winner
    toggleOverlay(nodeElements.popup);
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

  let _changeName = (person, displayName) => {
    let randomName = names[_randomNumber(names.length)];
    person.name = randomName;
    displayName.innerText = randomName;
  };

  let _randomNumber = (listLength) => {
    return Math.floor(Math.random() * listLength);
  };

  let changePlayerMode = (x) => {
    // Check which button to change status
    toggleAiMode(x.target.classList);

    let playerButtonID = x.target.getAttribute("data-player");

    // Change player state
    if (playerButtonID == "player1") player1.isRobot = !player1.isRobot;
    else player2.isRobot = !player2.isRobot;
  };

  let toggleOverlay = (overlay) => {
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

  let startGame = () => {
    // Check if player1/player2 names are empty
    if (player1.name == undefined) {
      _changeName(player1, nodeElements.displayName1);
    }

    if (player2.name == undefined) {
      _changeName(player2, nodeElements.displayName2);
    }

    // Toggle overlay
    toggleOverlay(nodeElements.overlay);

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
      nodeElements.karateIconPlayer1.classList.toggle("close");
      nodeElements.robotIconPlayer1.classList.toggle("close");
    } else {
      nodeElements.karateIconPlayer2.classList.toggle("close");
      nodeElements.robotIconPlayer2.classList.toggle("close");
    }
  };

  let _disableGrid = () => {
    let increment = 0;
    while (increment < nodeElements.squares.length) {
      nodeElements.squares[increment].setAttribute("disabled", "disabled");
      ++increment;
    }
  };

  let _enableGrid = () => {
    let increment = 0;
    while (increment < nodeElements.squares.length) {
      nodeElements.squares[increment].removeAttribute("disabled");
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
  nodeElements.nameInputs.forEach((nameInput) => {
    nameInput.addEventListener("change", () => {
      // Check if input value is empty
      let inputName = nameInput.value.trim();
      nameInput.value =
        !(inputName != "") || inputName.length > 15
          ? names[_randomNumber(names.length)]
          : nameInput.value;

      // Change player name
      if (nameInput.id === "player-1") {
        player1.name = nameInput.value;
        nodeElements.displayName1.innerText = nameInput.value;
      } else {
        player2.name = nameInput.value;
        nodeElements.displayName2.innerText = nameInput.value;
      }
    });
  });

  // Detect when grid is clicked
  nodeElements.squares.forEach((square) =>
    square.addEventListener("click", (grid) => {
      let gridTarget = grid.target;
      let gridLength = gridTarget.childNodes.length;
      let gridIndex = gridTarget.getAttribute("data-grid-button");
      markGrid(gridTarget, gridIndex, gridLength);
    })
  );

  nodeElements.resetButton.forEach((resetButton) => {
    resetButton.addEventListener("click", resetGame);
  });

  nodeElements.returnBackButton.addEventListener("click", () => {
    toggleOverlay(nodeElements.overlay);
  });

  nodeElements.popupCloseButton.forEach((hidePopup) => {
    hidePopup.addEventListener("click", () => {
      toggleOverlay(nodeElements.popup);
    });
  });

  nodeElements.startGameButton.addEventListener("click", startGame);

  nodeElements.playerModeButton1.forEach((x) => {
    x.addEventListener("click", changePlayerMode);
  });

  return {};
})();
