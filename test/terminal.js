/**
 * terminal.js v0.1.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

const chai     = require('chai');
const Terminal = require('../js/src/terminal.js');

describe('Terminal', () => {
  const main = new Terminal();

  describe('constructor', () => {
    it('is 16 rows deep', () => {
      chai.assert.equal(16, main.getRows());
    });

    it('is 12 columns wide', () => {
      chai.assert.equal(12, main.getColumns());
    });

    it('has an empty word array', () => {
      chai.assert.equal(0, main.getWords().length);
    });

    it('has 4 attempts', () => {
      chai.assert.equal(4, main.getAttempts());
    });

    it('has no initial password', () => {
      chai.assert.equal('', main.getPassword());
    });

    it('is either four, six, or eight difficulty', () => {
      chai.assert.oneOf(main.difficulty, ['four', 'six', 'eight']);
    });
  });

  describe('attempts', () => {
    it('is now 3 attempts', () => {
      main.decreaseAttempt();

      chai.assert.equal(3, main.getAttempts());
    });

    it('is now 4 attempts', () => {
      main.replenishAttempts();

      chai.assert.equal(4, main.getAttempts());
    });
  });
});
