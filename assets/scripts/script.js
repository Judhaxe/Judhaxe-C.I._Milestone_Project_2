import { MemoryGame } from './memorygame.js';
// Game data for the marvel matching game (An array of image objects)
const gameData = [
  { id: 1, image: 'assets/images/Ronaldo.webp' },
  { id: 2, image: 'assets/images/CR7.webp' },
  { id: 3, image: 'assets/images/Ronaldinho.webp' },
  { id: 4, image: 'assets/images/Robben.webp' },
  { id: 5, image: 'assets/images/Messi.webp' },
  { id: 6, image: 'assets/images/Zidane.webp' },
  { id: 7, image: 'assets/images/Maradona.webp' },
  { id: 8, image: 'assets/images/Lautaro.webp' }
];

/* 
  New game variables. They are reset to these values every time a 
  new game is started
*/
let game = new MemoryGame(gameData);
let selectionReset = false;
let isGameStarted = false;
let isGameWon = false;
const timer = new Timer();
let totalTime = '0:00';

setupGame();

// This function sets up the game.
function setupGame() {
  for (let i = 0; i < game.gameData.length; i++) {
    $(".game-container").append(`<div class="game-item shake"></div>`);
  }
  addEventListeners();
  game.start();
  totalGuess(0);
  totalMatches(0);
}

/*
  Adds click event listeners to each div and 
  calls the getTotalTime function to run every 100 milliseconds
*/
function addEventListeners() {
  $(".game-item").click(gameItemClick);
  $("#reset-button").click(resetGame);
  setInterval(getTotalTime, 100);
}

// Calculates time in minutes and seconds then displays it in the time box
function getTotalTime() {
  let timeInMinutes = Math.floor(timer.getTime() / 60000).toString().padStart(1, "0");
  let timeInSeconds = ((timer.getTime() % 60000) / 1000).toFixed(0).toString().padStart(2, "0");
  totalTime = `${timeInMinutes}:${timeInSeconds}`;
  $('.total-time').text(totalTime);
}

// This function is called when the event listener receives a click in a game item div. 
function gameItemClick() {
  // If the game is won the remainder of this function will not run.
  if (isGameWon) {
    return;
  }
  // If the game has not been started this statement starts the timer.
  if (!isGameStarted) {
    isGameStarted = true;
    timer.start();
  }
  // If the selected images do not match the clicked class is removed and the background image replaced.
  if (selectionReset) {
    $(".game-item:not(.matched)").css("background-image", `url(assets/images/Goal.webp)`).removeClass("clicked");
  }
  // Adds a class of clicked to the imaged that has been clicked.
  $(this).addClass("clicked");

  // This is the index of the game image that has been clicked
  let gameItemPosition = $(this).index();
  // This variable holds the guess function with the index of the clicked game image as a parameter. 
  let gameGuess = game.guess(gameItemPosition);
  // Results true if two images have been clicked and not matched.
  selectionReset = gameGuess.isMaxAmountOfGuesses && !gameGuess.isMatch;

  // Finds the id of the images clicked and displays the corresponding image.
  let gameItem = gameGuess.originalGuessedItems.find(x => x.position == gameItemPosition);
  $(this).css("background-image", `url(${gameItem.image})`);
  // Adds matched class & removes clicked class if images have matched.
  if (gameGuess.isMatch) {
    $(".game-item.clicked").removeClass("clicked").addClass("matched");
  }

  // This variable holds the number of guesses taken to complete the game.
  totalGuess(gameGuess.numberOfGuessesTaken);
  //This variable holds the total game score.
  totalMatches(gameGuess.matchScore);

  // If the game is completed this function stops the timer and displays an alert.
  if (gameGuess.isGameWon) {
    isGameWon = true;
    timer.stop();
    Swal.fire(
      'Good job!',
      `You've Won, In a time of ${totalTime}`,
      'success'
    );
  }
}

// Displays the total amount of guesses the user takes to complete the game.
function totalGuess(numberOfGuessesTaken) {
  $(".guess-total").text(numberOfGuessesTaken);
}

// Displays the total amount of matches.
function totalMatches(matchScore) {
  $(".match-total").text(`${matchScore}/${game.originalGameDataLength}`);
}

// Function to reset the game.
function resetGame() {
  $(".game-item").css("background-image", `url(assets/images/Goal.webp)`).removeClass("matched");
  game.reset();
  timer.reset();
  totalGuess(0);
  totalMatches(0);
  isGameWon = false;
  isGameStarted = false;
  game.start();
}

