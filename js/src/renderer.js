/**
 * renderer.js v0.1.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Renderer() {
  this.utils = '';
}

/**
 * Printer
 *
 * Writes text to the output column while deleting the upper-most `<p>` element
 * to maintain visual appeal.
 *
 * @param {String} text -- The text to print.
 */
Renderer.prototype.print = function (text) {
  $('<p>&gt;' + text + '</p>').insertBefore($('#results > p:eq(14)'));

  $('#results > p:eq(0)').remove();
};

/**
 * Attempt Renderer
 *
 * Initially, this will render four attempts.
 * Otherwise, this will render anywhere between 0 - 3 attempts, depending on
 * whether the player has attempted to guess the password or not.
 *
 * @param {Integer} attempts -- The amount of attempts the user has.
 */
Renderer.prototype.renderAttempts = function (attempts) {
  for (let i = $('#attempts > .attempt').length; i < attempts; i++) {
    $('#attempts').append('<span class="attempt">&nbsp;</span>');
  }
};

/**
 * Character Renderer
 *
 * Renders a random character for `rows * columns` amount within a given row. *
 *
 * @param {Element} $element   -- The document element.
 * @param {Array}   characters -- The array of random characters.
 * @param {Integer} rows       -- The amount of rows to render in.
 * @param {Integer} columns    -- The amount of columns to render in.
 */
Renderer.prototype.renderCharacters = function ($element, characters, rows, columns) {
  for (let i = 0; i < rows; i++) {
    $element.append('<div data-row="' + i + '"></div>');

    for (let x = 0; x < columns; x++) {
      const number = this.utils.randomNumberWithinRange(0, characters.length);

      $element
        .find('> div:last-child')
        .append('<span data-column="' + x + '">' + characters[number] + '</span>');
    }
  }
};

/**
 * Output Renderer
 *
 * Renders the initial column of empty `<p>` elements `rows - 1` times.
 *
 * @param {Integer} rows -- The amount of rows, to visually match the board.
 */
Renderer.prototype.renderOutput = function (rows) {
  for (let i = 0; i < rows; i++) {
    if (i + 1 === rows) {
      $('#results').append('<p>&gt;<span class="entry" id="entry"></span></p>');
    } else {
      $('#results').append('<p>&nbsp;</p>');
    }
  }
};

/**
 * Pointer Render
 *
 * Renders the given pointers in their respective columns.
 *
 * @param {Array} pointers -- An array of pointers.
 */
Renderer.prototype.renderPointers = function (pointers) {
  for (let i = 0; i < pointers.length; i++) {
    if (i < pointers.length / 2) {
      $('#pointer-1').append('<span>' + pointers[i] + '</span>');
    } else {
      $('#pointer-2').append('<span>' + pointers[i] + '</span>');
    }
  }
};

/**
 * Surrounding Character Renderer
 *
 * Following rule #3, this renders `1 - (n - 2)` surrounding character blocks
 * randomly within the board.
 *
 * @param {Array}   words       -- All words from Terminal.
 * @param {Array}   surrounders -- The surrounding character blocks.
 * @param {Integer} rows        -- The amount of rows.
 * @param {Integer} columns     -- The amount of columns.
 */
Renderer.prototype.renderSurrounders = function (words, surrounders, rows, columns) {
  const total = this.utils.randomNumberWithinRange(1, words.length - 2);

  for (let i = 0; i < total; i++) {
    const row        = this.utils.randomNumberWithinRange(0, (rows * 2));
    const surrounder = this.utils.randomNumberWithinRange(0, surrounders.length);

    let $row = '';
    if (row < rows) {
      $row = $('#text-1 > div:eq(' + row + ')');
    } else {
      $row = $('#text-2 > div:eq(' + (row - rows) + ')');
    }

    if ($row.text().match(/[a-z]/i)) {
      i--;

      // TODO: Allow for surrounding characters to appear near words.

      continue;
    } else {
      const start = this.utils.randomNumberWithinRange(0, columns - 1);
      const stop  = this.utils.randomNumberWithinRange(start + 1, columns);

      for (let x = start; x <= stop; x++) {
        const $span = $row.find('> span:eq(' + x + ')');

        $span.attr('data-surround', i);

        if (i === 0) {
          $span.attr('data-replenishes', true);
        }

        if (x === start) {
          $span.text(surrounders[surrounder].substring(0, 1));
        } else if (x === stop) {
          $span.text(surrounders[surrounder].substring(1, 2));
        }
      }
    }
  }
};

/**
 * Word Renderer
 *
 * Renders all given words onto the board within the current characters.
 *
 * @param {Array}   words   -- The given words to render.
 * @param {Integer} rows    -- The amount of rows.
 * @param {Integer} columns -- The amount of columns.
 */
Renderer.prototype.renderWords = function (words, rows, columns) {
  let occupied = {};

  for (let i = 0; i < words.length; i++) {
    let random = -1;

    while (true) {
      random = this.utils.randomNumberWithinRange(0, (rows * columns * 2) - words[i].length);

      // Nothing is inside occupied on the first run through.
      if (i === 0) {
        occupied[random] = words[i].length;

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
        const currentMax  = random + words[i].length + 1;
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
        occupied[random] = words[i].length;

        break;
      }
    }

    // Iterate and render the possible password.
    for (let x = 0; x < words[i].length; x++, random++) {
      let $span;

      if ((rows * columns) <= random) {
        $span = $('#text-2 span:eq(' + (random - (rows * columns)) + ')');
      } else {
        $span = $('#text-1 span:eq(' + random + ')');
      }

      $span
        .text(words[i][x])
        .attr('data-word', words[i]);
    }
  }
};

/**
 * Mutators
 */
Renderer.prototype.setUtils = function (utils) {
  this.utils = utils;
};
