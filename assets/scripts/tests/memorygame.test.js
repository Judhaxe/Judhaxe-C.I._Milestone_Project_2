import { MemoryGame } from '../memorygame'
const gameData = [
  { id: 1, image: 'Ronaldo.webp' },
  { id: 2, image: 'CR&.webp' },
  { id: 3, image: 'Ronaldinho.webp' },
  { id: 4, image: 'Robben.webp' },
  { id: 5, image: 'Messi.webp' },
  { id: 6, image: 'Zidane.webp' },
  { id: 7, image: 'Maradona.webp' },
  { id: 8, image: 'Lautaro.webp' }
];

test('copies array to new array and joins them together', () => {
  let game = new MemoryGame(gameData);

  let duplicatedGameData = [...gameData];
  duplicatedGameData.push(...gameData);

  expect(game.duplicateArray(gameData)).toEqual(duplicatedGameData);
});

describe('test core game logic', () => {
  let game = new MemoryGame(gameData, false);

  game.start();

  /* 
    This represents the players first move. Randomisation has been disabled 
    so that the test can accurately guess that a match is made.
  */
  game.guess(0);
  let moveOne = game.guess(8);

  test('check first move is a match', () => {
    expect(moveOne.isMatch).toBeTruthy();
  });

  test('check score has been incremented', () => {
    expect(moveOne.matchScore).toBe(1);
  });

  test('check number of guesses taken has been incremented', () => {
    expect(moveOne.numberOfGuessesTaken).toBe(1);
  });

  /* 
    This represents the players second move. The selected guesses are of the same 
    position to test that the same selection cannot increment the score but does
    increment the number of guesses taken.
  */
  game.guess(0);
  let moveTwo = game.guess(8);

  test('check score has not been incremented', () => {
    expect(moveTwo.matchScore).toBe(1);
  });

  test('check number of guesses taken has been incremented', () => {
    expect(moveTwo.numberOfGuessesTaken).toBe(2);
  });

  /* 
  This represents the players third move. The selected guesses are of a 
  position the is known to not match.This is to test that a match is not made.
*/
  game.guess(0);
  let moveThree = game.guess(1);

  test('check third move is a match', () => {
    expect(moveThree.isMatch).toBeFalsy();
  });
});

// This tests the win state of the game. 
test('game win state', () => {
  let testGameData = [{ id: 1, image: 'Ronaldo.webp' }];
  let game = new MemoryGame(testGameData);

  game.start();

  game.guess(0);
  let moveOne = game.guess(1);

  expect(moveOne.isGameWon).toBeTruthy();
});

/* 
This is to test that if an anything other than an array
is passed into the constructor it will display an error message.
*/
test('error message displayed when not an array', () => {
  expect(() => {
    new MemoryGame('test');
  }).toThrow();
});

/*
This will test that the guess selected by the user is between 0 & the 
length of the array.
*/
test('error message displayed when guess is < 0 or > length of array', () => {
  expect(() => {
    let game = new MemoryGame(gameData);
    game.guess(-1);
  }).toThrow();
});

// Tests that the properties are reset
test('properties are reset', () => {
  let game = new MemoryGame(gameData);
  game.guess(0);
  game.guess(8);
  game.reset();

  expect(game.guessedItems).toEqual([]);
  expect(game.matchedItemsIds).toEqual([]);
  expect(game.numberOfGuessesTaken).toBe(0);
});