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
  this.pointers   = [];
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
 * Board Generator
 *
 * Generates an array-mirror of the board's content, complete
 * with symbols, blocks, and words.
 */
Terminal.prototype.generateBoard = function () {
  // Generate initial symbols.
  for (let i = 0; i < (this.rows * 2); i++) {
    let symbols = [];

    for (let i = 0; i < this.columns; i++) {
      const random = this.utils.pickRange(0, this.characters.length);

      symbols.push(this.characters[random]);
    }

    this.board.push(symbols);
  }

  // Generate word location.
  let   count    = 0;
  const location = this.renderWords(this.words, this.rows, this.columns);

  // Iterate through all playable words.
  for (let key in location) {
    let row    = Math.floor(key / this.columns);
    let column = Math.floor(((key / this.columns) - row) * this.columns);

    // Iterate through where the words will be placed down at.
    for (let i = 0; i < location[key]; i++, column++) {
      // Advance to a new row when applicable.
      if (column === 12) {
        row++;
        column = 0;
      }

      this.board[row][column] = this.words[count].charAt(i);
    }

    count++;
  }

  // Generate character blocks.
  const blocks = this.renderBlocks();

  // Contents: row, start, stop, block
  for (let i = 0; i < blocks.length; i++) {
    this.board[blocks[i][0]][blocks[i][1]] = this.blocks[blocks[i][3]].substring(0, 1);
    this.board[blocks[i][0]][blocks[i][2]] = this.blocks[blocks[i][3]].substring(1, 2);
  }
};

/**
 * Difficulty Generator
 *
 * Generates the difficulty by random.
 *
 * @todo More refined difficulty settings.
 */
Terminal.prototype.generateDifficulty = function () {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    this.setDifficulty('four');
  } else if (type === 1) {
    this.setDifficulty('six');
  } else if (type === 2) {
    this.setDifficulty('eight');
  }
};

/**
 * Password Generator
 *
 * Generates a password randomly from the set of words.
 */
Terminal.prototype.generatePassword = function () {
  const random = this.utils.pickRange(0, this.words.length);

  this.setPassword(this.words[random]);
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
  let pointer  = this.utils.generateInitialPointer();
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

  this.setPointers(pointers);
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
  let words = [];

  for (let i = 0; i < this.utils.pickRange(5, 10); i++) {
    const index = this.utils.pickRange(0, response[this.difficulty].length);

    words.push(response[this.difficulty][index]);
  }

  this.setWords(words);
};

/**
 * Block Characters Renderer
 *
 * Following rule #3, this renders 1 to `n - 2` surrounding character blocks
 * randomly within the board.
 */
Terminal.prototype.renderBlocks = function () {
  let   output = [];
  const total  = this.utils.pickRange(1, this.words.length - 2);

  // Iterate through the amount of blocks.
  for (let i = 0; i < total; i++) {
    let start = this.utils.pickRange(0, this.columns - 1);
    let stop  = this.utils.pickRange(start + 1, this.columns);

    const row   = this.utils.pickRange(0, (this.rows * 2));
    const text  = this.board[row].join('');
    const block = this.utils.pickRange(0, this.blocks.length);

    if (this.utils.hasText(text)) {
      let indexes = [];
      let stopper = 0;

      // Locate all letter indexes.
      for (let x = 0; x < text.length; x++) {
        if (this.utils.hasText(text.charAt(x))) {
          indexes.push(x);
        }
      }

      // Attempt to find a new start location.
      while (indexes.indexOf(start) > -1 || indexes.indexOf(start + 1) > -1) {
        start = this.utils.pickRange(0, this.columns - 1);

        if (stopper++ === 20) {
          this.utils.warner('Terminal.prototype.renderBlocks (1) stopper.');
          break;
        }
      }

      stopper = 0;

      // Attempt to find a new stop location.
      while (indexes.indexOf(stop) > -1) {
        stop = this.utils.pickRange(start + 1, this.columns);

        if (stopper++ === 20) {
          this.utils.warner('Terminal.prototype.renderBlocks (2) stopper.');
          break;
        }
      }
    }

    output.push([row, start, stop, block]);
  }

  return output;
};

/**
 * Word Renderer
 *
 * Returns an integer-based location representing where the words
 * will be rendered.
 *
 * @return {Array}
 */
Terminal.prototype.renderWords = function () {
  let occupied = {};

  for (let i = 0; i < this.words.length; i++) {
    let random  = -1;
    let stopper = 0;

    const max = (this.rows * this.columns * 2) - this.words[i].length;

    while (true) {
      random = this.utils.pickRange(0, max);

      // Nothing is inside occupied on the first run through.
      if (i === 0) {
        occupied[random] = this.words[i].length;

        break;
      }

      // Immediately try again if the same random number is generated.
      if (occupied.hasOwnProperty(random)) {
        continue;
      }

      let freeToGo = false;

      // Determine if the number is within previously generated numbers.
      for (let key in occupied) {
        // Leave some character spacing between words.
        const currentMin  = random + 1;
        const currentMax  = random + this.words[i].length + 1;
        const previousMin = parseInt(key, 10) - 1;
        const previousMax = parseInt(key, 10) + parseInt(occupied[key], 10) + 1;

        const isMinGood = previousMin <= currentMin && currentMin <= previousMax;
        const isMaxGood = previousMin <= currentMax && currentMax <= previousMax;

        // Rather than checking if they current numbers are outside the range,
        // check if the current numbers are within the range. This will assure
        // that all previously occupied ranges are gone through.
        if (isMinGood || isMaxGood) {
          freeToGo = false;

          break;
        } else {
          freeToGo = true;
        }
      }

      // https://i.imgur.com/k4YYzDZ.jpg
      if (freeToGo) {
        occupied[random] = this.words[i].length;

        break;
      }

      stopper++;

      if (stopper === 20) {
        this.utils.warner('Terminal.prototype.renderWords stopper.');

        break;
      }
    }
  }

  return occupied;
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

Terminal.prototype.getBoard = function () {
  return this.board;
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

Terminal.prototype.getPointers = function () {
  return this.pointers;
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

Terminal.prototype.setPointers = function (pointers) {
  this.pointers = pointers;
};

Terminal.prototype.setWords = function (words) {
  this.words = words;
};

Terminal.prototype.setUtils = function (utils) {
  this.utils = utils;
};

module.exports = Terminal;
