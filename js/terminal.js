/**
 *
 */

function Terminal() {
  this.rows    = 16;
  this.columns = 12;

  this.words    = new Array();
  this.attempts = 4;
  this.password = '';

  this.characters = [
    ',',  '.',  '/',
    '!',  '%',  '&',
    '-',  '+',  '=',
    '?',  '$',  '*',
    '^',  ';',  ':',
    '@',  '#',  '"',
    "'",  '~',  '|',
    '_',  '`',  '\\'
  ];

  this.surrounders = [
    '<>',
    '[]',
    '{}',
    '()'
  ];
}

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

Terminal.prototype.determinePassword = function () {
  this.password = this.words[this._randomRangeNumber(0, this.words.length)];

  console.log('Password: ' + this.password);
};

Terminal.prototype.generateWords = function () {
  const random   = Math.floor(Math.random() * 3);
  let difficulty = '';

  if (random === 0) {
    difficulty = 'four';
  } else if (random === 1) {
    difficulty = 'six';
  } else {
    difficulty = 'eight';
  }

  console.info('Difficulty Setting is: ' + difficulty);

  for (let i = 0; i < this._randomRangeNumber(5, 10); i++) {
    this.words.push(_words[difficulty][this._randomRangeNumber(0, _words[difficulty].length)]);
  }

  console.info(this.words);
};

Terminal.prototype.renderAttempts = function () {
  for (let i = $('#attempts > .attempt').length; i < this.attempts; i++) {
    $('#attempts').append('<span class="attempt">&nbsp;</span>');
  }
}

Terminal.prototype.renderCharacters = function () {
  this._renderCharacterLoop('#text-1');
  this._renderCharacterLoop('#text-2');
};

Terminal.prototype.renderOutput = function () {
  for (let i = 0; i < this.rows; i++) {
    if (i + 1 == this.rows) {
      $('#results').append('<p>&gt;<span id="entry"></span></p>');
    } else {
      $('#results').append('<p>&nbsp;</p>');
    }
  }
};

Terminal.prototype.renderPointers = function () {
 // Generate pointers
  let pointers = new Array();

  for (let i = 0; i < (this.rows * 2); i++) {
    pointers.push('0x' + ('1234' + Math.floor(Math.random() * 12345).toString(16).toUpperCase()).substr(-4));
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

Terminal.prototype.renderSurrounders = function () {
  // Rule #3.
  const amount = this._randomRangeNumber(1, this.words.length - 2);

  for (let i = 0; i < amount; i++) {
    const randomSurrounder = this._randomRangeNumber(0, this.surrounders.length);

    const randomRow = this._randomRangeNumber(0, (this.rows * 2));

    const $row = randomRow < this.rows
      ? $('#text-1 > div:eq(' + randomRow + ')')
      : $('#text-2 > div:eq(' + (randomRow - this.rows) + ')');

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

Terminal.prototype.renderWords = function () {
  let occupied = {};

  for (let i = 0; i < this.words.length; i++) {
    console.info('Rendering: ' + this.words[i]);

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

        // Rather than checking if they current numbers are outside the range,
        // check if the current numbers are within the range. This will assure
        // that all previously occupied ranges are gone through.
        if ((previousMin <= currentMin && currentMin <= previousMax) || (previousMin <= currentMax && currentMax <= previousMax)) {
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
      const $span = (this.rows * this.columns) <= random
        ? $('#text-2 span:eq(' + (random - (this.rows * this.columns)) + ')')
        : $('#text-1 span:eq(' + random + ')');

      $span
        .text(this.words[i][x])
        .attr('data-word', this.words[i]);
    }
  }
};

Terminal.prototype._getPopulation = function (element) {
  if (element.is('[data-surround]') && ['<', '[', '{', '('].indexOf(element.text()) > -1) {
    return $('span[data-surround="' + element.attr('data-surround') + '"]');
  } else if (element.is('[data-word]')) {
    return $('span[data-word="' + element.attr('data-word') + '"]');
  } else {
    return element;
  }
};

Terminal.prototype._insertOutput = function (text) {
  $('<p>&gt;' + text + '</p>').insertBefore($('#results > p:eq(14)'));

  $('#results > p:eq(0)').remove();
}

Terminal.prototype._randomRangeNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

Terminal.prototype._renderCharacterLoop = function(element) {
  for (let i = 0; i < this.rows; i++) {
    $(element).append('<div></div>');

    for (let x = 0; x < this.columns; x++) {
      $(element)
        .find('> div:last-child')
        .append('<span>' + this.characters[this._randomRangeNumber(0, this.characters.length)] + '</span>');
    }
  }
};

/**
 * Accessors
 */
Terminal.prototype.getCharacters = function () {
  return this.characters;
};

Terminal.prototype.getSurrounders = function () {
  return this.surrounders;
};

const terminal = new Terminal();
terminal.renderPointers();
terminal.generateWords();
terminal.determinePassword();
terminal.renderCharacters();
terminal.renderWords();
terminal.renderSurrounders();
terminal.renderAttempts();
terminal.renderOutput();
terminal.attachEventListeners();
