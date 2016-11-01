/**
 *
 */

function Terminal() {
  this.rows    = 16;
  this.columns = 12;

  this.words    = new Array();
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
  $('.text span')
    .mouseover(function() {
      let $population = $(this);

      if ($(this).is('[data-surround]') && ['<', '[', '{', '('].indexOf($(this).text()) > -1) {
        $population = $('span[data-surround="' + $(this).attr('data-surround') + '"]');
      } else if ($(this).is('[data-word]')) {
        $population = $('span[data-word="' + $(this).attr('data-word') + '"]');
      }

      $population.addClass('is-hover');
    })
    .mouseout(function() {
      let $population = $(this);

      if ($(this).is('[data-surround]')) {
        $population = $('span[data-surround="' + $(this).attr('data-surround') + '"]');
      } else if ($(this).is('[data-word]')) {
        $population = $('span[data-word="' + $(this).attr('data-word') + '"]');
      }

      $population.removeClass('is-hover');
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

Terminal.prototype.renderCharacters = function () {
  this._renderCharacterLoop('#text-1');
  this._renderCharacterLoop('#text-2');
};

Terminal.prototype.renderPointers = function () {
  for (let i = 0; i < 15; i++) {
    $('#pointer-1').append('<span>' + this.pointers[i] + '</span>');
  }

  for (let i = 15; i < 30; i++) {
    $('#pointer-2').append('<span>' + this.pointers[i] + '</span>');
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
      const start = this._randomRangeNumber(0, 11);
      const stop  = this._randomRangeNumber(start + 1, 12);

      for (let x = start; x <= stop; x++) {
        const $span = $row.find('> span:eq(' + x + ')');

        $span.attr('data-surround', i);

        if (i === 0) {
          $span.attr('data-replenishes', true);
        }

        if (x === start) {
          $span.text(this.surrounders[randomSurrounder].substring(0, 1));
        } else if (x === stop) {
          $span.text(this.surrounders[randomSurrounder].substring(1, ));
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
      const $span = 180 <= random
        ? $('#text-2 span:eq(' + (random - 180) + ')')
        : $('#text-1 span:eq(' + random + ')');

      $span
        .text(this.words[i][x])
        .attr('data-word', this.words[i]);
    }
  }
};

Terminal.prototype._generatePointers = function () {
  for (let i = 0; i < 30; i++) {
    this.pointers.push(this._randomPointer());
  }
};

Terminal.prototype._randomPointer = function () {
  return '0x' + ('1234' + Math.floor(Math.random() * 12345).toString(16).toUpperCase()).substr(-4);
};

Terminal.prototype._randomRangeNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

Terminal.prototype._renderCharacterLoop = function(element) {
  for (let i = 0; i < this.rows; i++) {
    $(element).append('<div></div>');

    for (let x = 0; x < 12; x++) {
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

Terminal.prototype.getPointers = function () {
  return this.pointers;
};

Terminal.prototype.getSurrounders = function () {
  return this.surrounders;
};

const terminal = new Terminal();
terminal._generatePointers();
terminal.renderPointers();
terminal.generateWords();
terminal.determinePassword();
terminal.renderCharacters();
terminal.renderWords();
terminal.renderSurrounders();
terminal.attachEventListeners();
