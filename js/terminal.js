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
terminal.renderPointers();
