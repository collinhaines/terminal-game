/**
 * terminal.js v0.1.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Terminal() {
  // Declare the amount of rows and columns.
  this.rows    = 16;
  this.columns = 12;

  // Initialize class-wide variables.
  this.utils    = '';
  this.words    = [];
  this.attempts = 4;
  this.password = '';

  // Initialize the special characters.
  // TODO: Include surrounding characters without creating
  //       false positives on surrounding statements.
  this.characters = [
    ',',  '.',  '/',
    '!',  '%',  '&',
    '-',  '+',  '=',
    '?',  '$',  '*',
    '^',  ';',  ':',
    '@',  '#',  '"',
    '`',  '~',  '|',
    '_',  '\'', '\\'
  ];

  // Initialize the surrounding characters.
  this.surrounders = [
    '<>',
    '[]',
    '{}',
    '()'
  ];

  // Generate the difficulty.
  // TODO: More refined difficulty settings.
  this.difficulty = '';
  switch (Math.floor(Math.random() * 3)) {
    case 0:
      this.difficulty = 'four';
      break;
    case 1:
      this.difficulty = 'six';
      break;
    case 2:
      this.difficulty = 'eight';
      break;
  }
}

/**
 * Decrease
 *
 * Decreases attempts by 1.
 */
Terminal.prototype.decreaseAttempt = function () {
  this.attempts = this.attempts - 1;
};

/**
 * Password Generator
 *
 * Generates a password randomly from the set of words.
 */
Terminal.prototype.generatePassword = function () {
  const number = this.utils.randomNumberWithinRange(0, this.words.length);

  this.password = this.words[number];
};

/**
 * Pointer Generator
 *
 * By following Fallout 3, New Vegas, and 4's tradition of pointer increments,
 * this creates a random hexadecimal location, and increments it `this.rows * 2`
 * times while keeping the traditional ending seen in the games.
 *
 * @return {Array}
 */
Terminal.prototype.generatePointers = function () {
  // Generate pointers
  let pointer  = 0;
  let pointers = [];

  // If the pointer is below 256, the length of `.toString(16)` is 2.
  // Why? Go to France around the year 770 and ask them.
  while (pointer < 256) {
    // We're going truly random here.
    pointer = Math.floor(Math.random() * parseInt(Math.random().toString().substring(2, 6), 10));
  }

  for (let i = 0, loop = 0; i < (this.rows * 2); i++, loop++, pointer++) {
    // Convert to hexadecimal.
    let convert = pointer.toString(16).toUpperCase();

    // Grab the last three characters.
    if (convert.length > 3) {
      convert = convert.substring(convert.length - 3, convert.length);
    }

    // There's probably a reason why every hacking terminal in Fallout have
    // these constant endings.
    //
    // Fallout 4 starts with 0.
    // Fallout 3 starts with C.
    // Fallout: NV seems to start randomly.
    switch (loop) {
      case 0:
        convert = convert + '0';
        break;
      case 1:
        convert = convert + 'C';
        break;
      case 2:
        convert = convert + '8';
        break;
      case 3:
        loop    = -1;
        convert = convert + '4';
        break;
    }

    pointers.push('0x' + convert);
  }

  return pointers;
};

/**
 * Word Generator
 *
 * Given a huge list of words, generate a random amount of words from
 * said given list.
 *
 * @param {Object} response -- The JSON object from `words.json`.
 */
Terminal.prototype.generateWords = function (response) {
  const amount = this.utils.randomNumberWithinRange(5, 10);

  for (let i = 0; i < amount; i++) {
    const index = this.utils.randomNumberWithinRange(0, response[this.difficulty].length);

    this.words.push(response[this.difficulty][index]);
  }
};

/**
 * Replenisher
 *
 * Replenishes attempts to 4.
 */
Terminal.prototype.replenishAttempts = function () {
  this.attempts = 4;
};

/**
 * Accessors
 */
Terminal.prototype.getAttempts = function () {
  return this.attempts;
};

Terminal.prototype.getCharacters = function () {
  return this.characters;
};

Terminal.prototype.getColumns = function () {
  return this.columns;
};

Terminal.prototype.getRows = function () {
  return this.rows;
};

Terminal.prototype.getPassword = function () {
  return this.password;
};

Terminal.prototype.getSurrounders = function () {
  return this.surrounders;
};

Terminal.prototype.getWords = function () {
  return this.words;
};

/**
 * Mutators
 */
Terminal.prototype.setWords = function (words) {
  this.words = words;
};

Terminal.prototype.setUtils = function (utils) {
  this.utils = utils;
};


module.exports = Terminal;
