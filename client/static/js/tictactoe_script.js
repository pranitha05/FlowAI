let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "2P";

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function startGame(mode) {
  gameMode = mode;
  resetGame();
  document
    .getElementById("twoPlayerBtn")
    .classList.toggle("active", mode === "2P");
  document
    .getElementById("vsComputerBtn")
    .classList.toggle("active", mode === "AI");
}

function makeMove(cell, index) {
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("disabled");

  if (checkWin()) {
    gameActive = false;
    displayResult(`${currentPlayer} wins!`, "result-win");
  } else if (board.every((cell) => cell)) {
    gameActive = false;
    displayResult("It's a draw!", "result-draw");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (gameMode === "AI" && currentPlayer === "O" && gameActive) {
      setTimeout(makeSmartMove, 500);
    }
  }
}

function makeSmartMove() {
  const bestMove = getBestMove();
  makeMove(document.querySelectorAll(".cell")[bestMove], bestMove);
}

function getBestMove() {
  // Check for win opportunity or block opponent logic here (same as previous)
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
    if (board[a] === "O" && board[c] === "O" && board[b] === "") return b;
    if (board[b] === "O" && board[c] === "O" && board[a] === "") return a;
  }

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
    if (board[a] === "X" && board[c] === "X" && board[b] === "") return b;
    if (board[b] === "X" && board[c] === "X" && board[a] === "") return a;
  }

  if (board[4] === "") return 4;
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (board[corner] === "") return corner;
  }

  return board.findIndex((cell) => cell === "");
}

function checkWin() {
  return winConditions.some((condition) =>
    condition.every((index) => board[index] === currentPlayer)
  );
}

function displayResult(message, className) {
  const resultDiv = document.getElementById("result");
  const resultMessage = document.getElementById("result-message");

  resultDiv.classList.add(className); // Apply win/draw specific styling
  resultMessage.textContent = message;
  resultDiv.style.display = "block"; // Show result
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("disabled");
  });
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "none"; // Hide result on game reset
  resultDiv.classList.remove("result-win", "result-draw"); // Remove any result styling
}
