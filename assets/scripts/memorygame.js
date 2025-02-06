export class MemoryGame {
  constructor(gameData, shouldRandomise) {
  /*
    An error will be displayed in the console if the game data
    passed in to the constructor is not an array.
  */
    if (!(gameData instanceof Array)) {
      throw new Error("Parameter is not an Array!");
    }

    // The length of the original gameData array
    this.originalGameDataLength = gameData.length;
    /*
      Call the duplicateArray function and creates an object
      to be used for this instance game
    */
    this.gameData = this.duplicateArray(gameData);
    // This is the highest position that can be guessed.
    this.maxPosGuess =  this.gameData.length - 1;
    // This disables randomisation for testing.
    this.shouldRandomise = shouldRandomise;

    // An array to store the two items that have been chosen.
    this.guessedItems = [];
    // This is the lowest position that can be guessed.
    this.minPosGuess = 0;
    // An array to store the ID of a correct match.
    this.matchedItemsIds = [];
    // Total number of guesses taken to complete game.
    this.numberOfGuessesTaken = 0;
  }

  /*
  Call the randomiseArray function to randomise the objects within
  the array for this instance of the game and assign it to itself
  */
  start() {
    if (this.shouldRandomise !== false) {
      this.gameData = this.randomiseArray(this.gameData);
    }
  }

  // Copy the game data  array and add it to the existing game data array
  duplicateArray(array) {
    array.push(...array.slice());
    return array;
  }

  // Randomise the order of the objects within the array
  /*
    Credit: Fisher-Yates Sorting Algorithm
    https://www.freecodecamp.org/news/how-to-shuffle-an-array
    -of-items-using-javascript-or-typescript/
  */
  randomiseArray(array) {
    for (let i = 0; i < array.length; i++) {
      let randomPosition = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      // swap items
      array[i] = array[randomPosition];
      array[randomPosition] = temp;
    }
    return array;
  }

  guess(position) {
    /*
      Check if selected position is higher than 0 and not higher than the array
      than this instance of the game data array length
    */
    if (position < this.minPosGuess || position > this.maxPosGuess) {
      throw new Error(`Must be between ${this.minPosGuess} & ${this.maxPosGuess}`);
    }

    // Store the selected position in this instance of the gameData array
    let item = this.gameData[position];
    item.position = position;
    // Push the selected position into the guessedItems array
    this.guessedItems.push(item);

    // Check if only 2 guesses made. Returns Boolean.
    let isMaxAmountOfGuesses = this.guessedItems.length === 2;

    /*
      If only 2 guesses made and the id's for each selected 
      object match this is a match
    */
    let isMatch = isMaxAmountOfGuesses &&
      this.guessedItems[0].id === this.guessedItems[1].id;

    let hasPreviousMatch = this.matchedItemsIds.includes(this.guessedItems[0].id);

    // If a match is made and the id of the matched object is not in the matchedItemsIds add it
    if (isMatch && !hasPreviousMatch) {
      this.matchedItemsIds.push(this.guessedItems[0].id);
    }

    // Return a copy of this instance of the guessedItems array
    let originalGuessedItems = this.guessedItems.slice();

    if (isMaxAmountOfGuesses) {
      // Clear this instance of the guessedItems array.
      this.guessedItems = [];
      // increment the numberOfGuessesTaken by 1
      this.numberOfGuessesTaken++;
    }

    // Count the total number of matches made
    let matchScore = this.matchedItemsIds.length;

    /*
      If the length of this instance of the matchedItemsIds array is equal to this instance
      of the originalGameDataLength then the game is won
    */
    let isGameWon = this.matchedItemsIds.length === this.originalGameDataLength;
    let numberOfGuessesTaken = this.numberOfGuessesTaken;

    return {
      originalGuessedItems,
      isMatch,
      isGameWon,
      matchScore,
      numberOfGuessesTaken,
      isMaxAmountOfGuesses
    };
  }

  reset() {
    // Reset all properties
    this.guessedItems = [];
    this.matchedItemsIds = [];
    this.numberOfGuessesTaken = 0;
  }
}