const words = [
  "javascript",
  "hangman",
  "challenge",
  "programming",
  "developer",
  "algorithm",
  "computer",
  "variable",
  "function",
  "constant",
  "debugging",
  "frontend",
  "backend",
  "database",
  "interface",
  "software",
  "hardware",
  "internet",
  "keyboard",
  "monitor",
  "browser",
  "compiler",
  "framework",
  "library",
  "syntax",
  "condition",
  "iteration",
  "recursion",
  "constructor",
  "inheritance",
  "polymorphism",
  "encapsulation",
  "abstraction",
  "responsive",
  "animation",
  "application",
  "encryption",
  "decryption",
  "authentication",
  "authorization",
  "repository",
  "command",
  "terminal",
  "network",
  "protocol",
  "machine",
  "functionality",
  "testing",
  "debugger",
  "runtime",
  "execution",
  "container",
];

let selectedWord, displayWord, attempts, guessedLetters;

function startGame() {
  guessedLetters = [];
  attempts = 6;
  selectedWord = getRandomWord();
  displayWord = "_".repeat(selectedWord.length);
  updateDisplayWord();
  updateHangmanImage();
  document.getElementById("letterButtons").innerHTML = "";
  document.getElementById("resultOverlay").style.display = "none";
  createLetterButtons();
}

function resetGame() {
  startGame();
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function createLetterButtons() {
  const letterButtonsContainer = document.getElementById("letterButtons");
  letterButtonsContainer.innerHTML = "";
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i);
    const button = document.createElement("button");
    button.textContent = letter;
    button.setAttribute("data-letter", letter);
    button.onclick = () => handleGuess(letter);
    letterButtonsContainer.appendChild(button);
  }
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter) || attempts <= 0) return;

  guessedLetters.push(letter);
  const button = document.querySelector(`button[data-letter="${letter}"]`);

  if (selectedWord.includes(letter)) {
    button.classList.add("correct");
    updateDisplayWord();
    if (displayWord === selectedWord) {
      endGame("You Win!");
    }
  } else {
    button.classList.add("incorrect");
    attempts--;
    updateHangmanImage();
    if (attempts === 0) {
      endGame(`You Lose! The word was "${selectedWord}"`);
    }
  }
}

function updateDisplayWord() {
  displayWord = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join("");
  document.getElementById("wordDisplay").textContent = displayWord;
}

function updateHangmanImage() {
  const hangmanImage = document.getElementById("hangmanImage");

  const hangmanImages = [
    "hangman0.gif",
    "hangman1.gif",
    "hangman2.gif",
    "hangman3.gif",
    "hangman4.gif",
    "hangman5.gif",
    "hangman6.gif",
  ];

  hangmanImage.innerHTML = `<img src="images/${
    hangmanImages[6 - attempts]
  }" alt="Hangman Stage ${6 - attempts}">`;
}

function endGame(message) {
  document.getElementById("resultMessage").textContent = message;
  document.getElementById("resultOverlay").style.display = "flex";
}

startGame();
