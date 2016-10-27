/**
 *
 */

function Terminal() {
  this.words    = new Array();
  this.pointers = new Array();

  this.characters = [
    ',',  '.',  '/',
    '!',  '%',  '&',
    '-',  '+',  '=',
    '?',  '$',  '*'
  ];

  this.surrounders = [
    '<',  '>',
    '[',  ']',
    '{',  '}',
    '(',  ')'
  ];
}

Terminal.prototype._generatePointers = function () {
  for (let i = 0; i < 30; i++) {
    this.pointers.push(this._randomPointer());
  }
};

Terminal.prototype._randomPointer = function () {
  const hex = '1234' + Math.floor(Math.random() * 12345).toString(16).toUpperCase();

  return '0x' + hex.substring(hex.length - 4, hex.length);
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
