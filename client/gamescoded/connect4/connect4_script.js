let board = Array.from({ length: 6 }, () => Array(7).fill(null));
let currentPlayer = "player1";
let gameMode = "2P";
let gameActive = true;

document.addEventListener("DOMContentLoaded", () => {
  renderBoard();
  updateStatus(); // Initial status
});

function startGame(mode) {
  gameMode = mode;
  resetGame();
  document.getElementById("status").textContent = `Mode: ${mode}`;
  document
    .getElementById("twoPlayerBtn")
    .classList.toggle("active", mode === "2P");
  document
    .getElementById("vsComputerBtn")
    .classList.toggle("active", mode === "AI");
}

function makeMove(col) {
  if (!gameActive) return;
  for (let row = 5; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      renderBoard();
      if (checkWin(row, col)) {
        gameActive = false;
        displayResult(
          `${
            currentPlayer === "player1" ? "Player 1 (Blue)" : "Player 2 (Red)"
          } wins!`,
          "result-win"
        );
        displayReplayButton();
      } else if (board.flat().every((cell) => cell)) {
        gameActive = false;
        displayResult("It's a draw!", "result-draw");
        displayReplayButton();
      } else {
        currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
        updateStatus(); // Update the status with the next player's turn
        if (gameMode === "AI" && currentPlayer === "player2") {
          setTimeout(makeAIMove, 500);
        }
      }
      return;
    }
  }
}

function makeAIMove() {
  const col = getBestMove();
  makeMove(col);
}

function getBestMove() {
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) {
        board[row][col] = "player2";
        if (checkWin(row, col)) {
          board[row][col] = null;
          return col;
        }
        board[row][col] = "player1";
        if (checkWin(row, col)) {
          board[row][col] = null;
          return col;
        }
        board[row][col] = null;
        break;
      }
    }
  }
  return Math.floor(Math.random() * 7);
}

function checkWin(row, col) {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];
  const currentCell = board[row][col];
  for (let { x, y } of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * y;
      const newCol = col + i * x;
      if (board[newRow] && board[newRow][newCol] === currentCell) count++;
      else break;
    }
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * y;
      const newCol = col - i * x;
      if (board[newRow] && board[newRow][newCol] === currentCell) count++;
      else break;
    }
    if (count >= 4) return true;
  }
  return false;
}

function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.classList.add(cell);
      cellElement.onclick = () => makeMove(colIndex);
      boardElement.appendChild(cellElement);
    });
  });
}

function resetGame() {
  board = Array.from({ length: 6 }, () => Array(7).fill(null));
  currentPlayer = "player1";
  gameActive = true;
  renderBoard();
  updateStatus(); // Reset the status message
  hideResult();
  hideReplayButton();
}

function updateStatus() {
  if (gameActive) {
    document.getElementById("status").textContent = `${
      currentPlayer === "player1" ? "Player 1 (Blue)" : "Player 2 (Red)"
    }'s turn`;
  } else {
    document.getElementById("status").textContent = ""; // Clear status when game ends
  }
}

function displayResult(message, className) {
  const resultDiv = document.getElementById("result");
  const resultMessage = document.getElementById("result-message");
  resultDiv.classList.add(className); // Apply win/draw specific styling
  resultMessage.textContent = message;
  resultDiv.style.display = "block"; // Show result
}

function hideResult() {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "none";
  resultDiv.classList.remove("result-win", "result-draw"); // Remove any result styling
}

function displayReplayButton() {
  const replayBtnContainer = document.getElementById("replay-btn-container");
  replayBtnContainer.style.display = "block";
}

function hideReplayButton() {
  const replayBtnContainer = document.getElementById("replay-btn-container");
  replayBtnContainer.style.display = "none";
}
