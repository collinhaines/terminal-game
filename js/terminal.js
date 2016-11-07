/**
 * terminal.js v0.0.0
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
 * Retriever
 *
 * Retrieves the words from the words.json file via AJAX.
 *
 * @return {Object}
 */
Terminal.prototype.retrieveWords = function () {
  const data = $.ajax({
    url:   'words.json',
    async: false
  }).responseJSON;

  // Insert 5 - 10 words.
  for (let i = 0; i < this._randomRangeNumber(5, 10); i++) {
    const index = this._randomRangeNumber(0, data[this.difficulty].length);

    this.words.push(data[this.difficulty][index]);
  }

  // Determine the password.
  this.password = this.words[this._randomRangeNumber(0, this.words.length)];

  return this;
};

/**
 * Renderer
 *
 * Calls rendering functions, a few of which are required to be in order.
 *
 * @return {Object}
 */
Terminal.prototype.render = function () {
  // Render the attempts.
  this.renderAttempts();

  // Render the pointers.
  this.renderPointers();

  // Render the characters.
  this.renderCharacters('#text-1');
  this.renderCharacters('#text-2');

  // Render the words.
  this.renderWords();

  // Render the surrounding characters.
  this.renderSurrounders();

  // Render the output.
  this.renderOutput();

  return this;
};

/**
 * Event Listeners
 *
 * Attaches a mouse over, mouse out, and click event listener to each
 * `$('.text span')` element.
 *
 * Mouse over will determine if the character is a part of a population
 * of important notice (e.g. word, surrounding characters) and add a class
 * that visually shows the nearby characters are grouped for a reason.
 *
 * Mouse out will remove the visual.
 *
 * Click will do the initial discovery that mouse over does and then will
 * determine what occurs afterwards. Resulting in either a replenish, a dud
 * removal, an attempt decrease, a loss, a win, or nothing at all.
 */
Terminal.prototype.attachEventListeners = function () {
  const self = this;

  $('.text span')
    .mouseover(function() {
      const $population = self._getPopulation($(this));

      $population.addClass('is-hover');

      $('#entry').html($population.text().toUpperCase());
    })
    .mouseout(function() {
      const $population = self._getPopulation($(this));

      $population.removeClass('is-hover');

      $('#entry').html('');
    })
    .click(function () {
      const $population = self._getPopulation($(this));

      if ($population.is('[data-surround]')) {
        if ($population.is('[data-replenishes]')) {
          // Replenish attempts, internally.
          self.attempts = 4;

          // Replenish attempts, visually.
          self.renderAttempts();

          // Render the output.
          self._insertOutput($population.text());
          self._insertOutput('Tries reset.');
        } else {
          let removing;

          while (true) {
            const number = self._randomRangeNumber(0, self.words.length);
            // Pick a random word.
            removing = self.words[number];

            // Do not pick the password.
            if (removing !== self.password) {
              // Remove the word from being able to be picked again.
              self.words.splice(number, 1);

              break;
            }
          }

          // Remove the word visually.
          $('span[data-word="' + removing + '"]')
            .text('.')
            .removeAttr('data-word');

          // Render the output.
          self._insertOutput($population.text());
          self._insertOutput('Dud removed.');
        }

        // Remove this from being selected again.
        $population
          .text('.')
          .removeAttr('data-surround')
          .removeClass('is-hover');
      } else if ($population.is('[data-word]')) {
        if ($population.text() === self.password) {
          // TODO: Something better.
          self._insertOutput($population.text().toUpperCase());
          self._insertOutput('Entry granted.');

          $('.text span').off('click');
        } else {
          // Decrease attempts, internally.
          self.attempts--;

          // Decrease attempts, visually.
          $('#attempts > .attempt:last-child').remove();

          // TODO: Does the word go away and/or clickable again in the game?

          // Detect the likeness.
          let likeness = 0;
          for (let i = 0; i < $population.text().length; i++) {
            if ($population.text()[i] === self.password[i]) {
              likeness++;
            }
          }

          // Render the output.
          self._insertOutput($population.text().toUpperCase());
          self._insertOutput('Entry denied.');
          self._insertOutput('Likeness=' + likeness);

          // Player has failed to hack into the terminal.
          if (self.attempts === 0) {
            // TODO: Something better.
            self._insertOutput('Locked out.');

            $('.text span').off('click');
          }
        }
      }
    });
};

/**
 * Attempt Renderer
 *
 * When initially called, will render four attempts, otherwise will render
 * anywhere between 0 - 3 attempts, depending on whether the player has
 * attempted to guess the password or not.
 */
Terminal.prototype.renderAttempts = function () {
  for (let i = $('#attempts > .attempt').length; i < this.attempts; i++) {
    $('#attempts').append('<span class="attempt">&nbsp;</span>');
  }
};

/**
 * Character Renderer
 *
 * Renders a random character for `this.rows * this.columns` amount within
 * a given identifier of an element.
 *
 * @param {String} element -- The element identifier (e.g. the #id)
 */
Terminal.prototype.renderCharacters = function (element) {
  for (let i = 0; i < this.rows; i++) {
    $(element).append('<div></div>');

    for (let x = 0; x < this.columns; x++) {
      const char = this.characters[this._randomRangeNumber(0, this.characters.length)];

      $(element)
        .find('> div:last-child')
        .append('<span>' + char + '</span>');
    }
  }
};

/**
 * Output Renderer
 *
 * Probably better identified as output initializer, and by ignoring CSS flex,
 * this creates `this.rows - 1` empty `<p>` elements to visually show the
 * output being at the bottom.
 *
 * TODO: There probably is a better way (possible: flex) to do this.
 */
Terminal.prototype.renderOutput = function () {
  for (let i = 0; i < this.rows; i++) {
    if (i + 1 === this.rows) {
      $('#results').append('<p>&gt;<span id="entry"></span></p>');
    } else {
      $('#results').append('<p>&nbsp;</p>');
    }
  }
};

/**
 * Pointer Renderer
 *
 * By following Fallout 3, New Vegas, and 4's tradition of pointer increments,
 * this creates a random hexadecimal location, and increments it `this.rows * 2`
 * times while keeping the traditional ending seen in the games.
 */
Terminal.prototype.renderPointers = function () {
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

  // Render pointers.
  for (let i = 0; i < (this.rows * 2); i++) {
    if (i < this.rows) {
      $('#pointer-1').append('<span>' + pointers[i] + '</span>');
    } else {
      $('#pointer-2').append('<span>' + pointers[i] + '</span>');
    }
  }
};

/**
 * Surrounding Character Renderer
 *
 * By following rule #3, this renders 1 - `n - 2` surrounding character
 * blocks randomly within the screen.
 */
Terminal.prototype.renderSurrounders = function () {
  // Rule #3.
  const amount = this._randomRangeNumber(1, this.words.length - 2);

  for (let i = 0; i < amount; i++) {
    const randomSurrounder = this._randomRangeNumber(0, this.surrounders.length);

    const randomRow = this._randomRangeNumber(0, (this.rows * 2));

    let $row;

    if (randomRow < this.rows) {
      $row = $('#text-1 > div:eq(' + randomRow + ')');
    } else {
      $row = $('#text-2 > div:eq(' + (randomRow - this.rows) + ')');
    }

    if ($row.text().match(/[a-z]/i)) {
      i--;

      // TODO: Allow for surrounding characters to appear near words.

      continue;
    } else {
      const start = this._randomRangeNumber(0, this.columns - 1);
      const stop  = this._randomRangeNumber(start + 1, this.columns);

      for (let x = start; x <= stop; x++) {
        const $span = $row.find('> span:eq(' + x + ')');

        $span.attr('data-surround', i);

        if (i === 0) {
          $span.attr('data-replenishes', true);
        }

        if (x === start) {
          $span.text(this.surrounders[randomSurrounder].substring(0, 1));
        } else if (x === stop) {
          $span.text(this.surrounders[randomSurrounder].substring(1, 2));
        }
      }
    }
  }
};

/**
 * Word Renderer
 *
 * The star of the show. Without rendering the same word twice or rendering a
 * word within each other, this renders all words selected back in the
 * constructor while specifying which one is the password.
 */
Terminal.prototype.renderWords = function () {
  let occupied = {};

  for (let i = 0; i < this.words.length; i++) {
    let random;

    while (true) {
      random = this._randomRangeNumber(0, (this.rows * this.columns * 2) - this.words[i].length);

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
    }

    // Iterate and render the possible password.
    for (let x = 0; x < this.words[i].length; x++, random++) {
      let $span;

      if ((this.rows * this.columns) <= random) {
        $span = $('#text-2 span:eq(' + (random - (this.rows * this.columns)) + ')');
      } else {
        $span = $('#text-1 span:eq(' + random + ')');
      }

      $span
        .text(this.words[i][x])
        .attr('data-word', this.words[i]);
    }
  }
};

/**
 * Internal function to determine if the highlighted element has any important
 * "relatives" nearby.
 *
 * @param  {Element} element -- The initial highlighted element.
 * @return {Element or NodeList}
 */
Terminal.prototype._getPopulation = function (element) {
  if (element.is('[data-surround]') && ['<', '[', '{', '('].indexOf(element.text()) > -1) {
    return $('span[data-surround="' + element.attr('data-surround') + '"]');
  } else if (element.is('[data-word]')) {
    return $('span[data-word="' + element.attr('data-word') + '"]');
  } else {
    return element;
  }
};

/**
 * Internal function to write text to the output while deleting the upper-most
 * `<p>` element to maintain visual appeal.
 *
 * TODO: See `Terminal.prototype.renderOutput` TODO and possibly replicate here.
 *
 * @param {String} text -- The text to output.
 */
Terminal.prototype._insertOutput = function (text) {
  $('<p>&gt;' + text + '</p>').insertBefore($('#results > p:eq(14)'));

  $('#results > p:eq(0)').remove();
};

/**
 * Internal function to randomly generate a number within a range.
 *
 * @param  {Integer} min -- The minimum of the range.
 * @param  {Integer} max -- The maximum of the range.
 * @return {Integer}
 */
Terminal.prototype._randomRangeNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

module.exports = Terminal;
