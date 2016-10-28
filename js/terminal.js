/**
 *
 */

function Terminal() {
  this.words    = new Array();
  this.password = '';
  this.pointers = new Array();

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
    '<',  '>',
    '[',  ']',
    '{',  '}',
    '(',  ')'
  ];
}

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

Terminal.prototype.renderPointers = function () {
  for (let i = 0; i < 15; i++) {
    document.getElementById('pointer-1').insertAdjacentHTML('beforeend', '<span>' + this.pointers[i] + '</span>');
  }

  for (let i = 15; i < 30; i++) {
    document.getElementById('pointer-2').insertAdjacentHTML('beforeend', '<span>' + this.pointers[i] + '</span>');
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
