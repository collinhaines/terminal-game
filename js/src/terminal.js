/**
 * terminal.js v0.2.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Terminal() {
  // Class
  this.utils = '';

  // Static
  this.rows    = 16;
  this.columns = 12;

  // Dynamic
  this.board      = [];
  this.words      = [];
  this.attempts   = 4;
  this.password   = '';
  this.difficulty = '';

  // Initialize the block characters.
  this.blocks = [
    '<>',
    '[]',
    '{}',
    '()'
  ];

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
}

/**
 * Decrease
 *
 * Decreases attempts by 1.
 */
Terminal.prototype.decreaseAttempt = function () {
  this.setAttempts(this.getAttempts() - 1);
};

/**
 *
 */
};

/**
 * Difficulty Generator
 *
 * Generates the difficulty by random.
 *
 * @todo More refined difficulty settings.
 * @return {String}
 */
Terminal.prototype.generateDifficulty = function () {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    return 'four';
  } else if (type === 1) {
    return 'six';
  } else if (type === 2) {
    return 'eight';
  }
};

/**
 * Pointer Generator
 *
 * Generates an initial pointer the board will start at.
 *
 * @return {Integer}
 */
Terminal.prototype.generateInitialPointer = function () {
  let pointer = 0;
  let stopper = 0;

  // If the pointer is below 256, the length of `.toString(16)` is 2.
  // Why? Go to France around the year 770 and ask them.
  while (pointer < 256) {
    pointer = Math.floor(Math.random() * parseInt(Math.random().toString().substring(2, 6), 10));

    stopper++;

    if (stopper === 20) {
      this.utils.warner('Terminal.prototype.generateInitialPointer stopper.');

      break;
    }
  }

  return pointer;
};

/**
 * Password Generator
 *
 * Generates a password randomly from the set of words.
 *
 * @return {String}
 */
Terminal.prototype.generatePassword = function () {
  return this.words[this.utils.randomNumberWithinRange(0, this.words.length)];
};

/**
 * Pointer Generator
 *
 * By following Fallout 3, New Vegas, and 4's tradition of pointer increments,
 * this creates a random hexadecimal location, and increments it `this.rows * 2`
 * times while keeping the traditional ending seen in the games.
 *
 * Within the Fallout series, it appears the following ending starts the loop:
 * - Fallout 3 has the first pointer end in 'C'.
 * - Fallout 4 has the first pointer end in '0'.
 * - Fallout: NV has the first pointer end randomly.
 *
 * @return {Array}
 */
Terminal.prototype.generatePointers = function () {
  // Generate pointers
  let pointer  = this.generateInitialPointer();
  let pointers = [];

  for (let i = 0, loop = 0; i < (this.rows * 2); i++, loop++, pointer++) {
    let convert = this.utils.convertPointerToHexadecimal(pointer);

    // Attach the ending character.
    if (loop === 0) {
      convert = convert + '0';
    } else if (loop === 1) {
      convert = convert + 'C';
    } else if (loop === 2) {
      convert = convert + '8';
    } else if (loop === 3) {
      loop    = -1;
      convert = convert + '4';
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
 * @param  {Object} response -- The JSON object from `words.json`.
 * @return {Array}
 */
Terminal.prototype.generateWords = function (response) {
  let words = [];

  for (let i = 0; i < this.utils.randomNumberWithinRange(5, 10); i++) {
    const index = this.utils.randomNumberWithinRange(0, response[this.difficulty].length);

    words.push(response[this.difficulty][index]);
  }

  return words;
};

/**
 * Replenisher
 *
 * Replenishes attempts to 4.
 */
Terminal.prototype.replenishAttempts = function () {
  this.setAttempts(4);
};

/**
 * Accessors
 */
Terminal.prototype.getAttempts = function () {
  return this.attempts;
};

Terminal.prototype.getColumns = function () {
  return this.columns;
};

Terminal.prototype.getDifficulty = function () {
  return this.difficulty;
};

Terminal.prototype.getRows = function () {
  return this.rows;
};

Terminal.prototype.getPassword = function () {
  return this.password;
};

Terminal.prototype.getWords = function () {
  return this.words;
};

/**
 * Mutators
 */
Terminal.prototype.setAttempts = function (attempts) {
  this.attempts = attempts;
};

Terminal.prototype.setDifficulty = function (difficulty) {
  this.difficulty = difficulty;
};

Terminal.prototype.setPassword = function (password) {
  this.password = password;
};

Terminal.prototype.setWords = function (words) {
  this.words = words;
};

Terminal.prototype.setUtils = function (utils) {
  this.utils = utils;
};

module.exports = Terminal;
