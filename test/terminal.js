/**
 * terminal.js v0.1.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

const chai     = require('chai');
const Terminal = require('../js/src/terminal.js');

describe('Terminal', () => {
  const terminal = new Terminal();

  describe('constructor', () => {
    it('is 16 rows deep', () => {
      chai.assert.equal(16, terminal.getRows());
    });

    it('is 12 columns wide', () => {
      chai.assert.equal(12, terminal.getColumns());
    });

    it('has an empty word array', () => {
      chai.assert.equal(0, terminal.getWords().length);
    });

    it('has 4 attempts', () => {
      chai.assert.equal(4, terminal.getAttempts());
    });

    it('has no initial password', () => {
      chai.assert.equal('', terminal.getPassword());
    });

    it('is either four, six, or eight difficulty', () => {
      chai.assert.oneOf(terminal.difficulty, ['four', 'six', 'eight']);
    });
  });

  describe('attempts', () => {
    it('is now 3 attempts', () => {
      terminal.decreaseAttempt();

      chai.assert.equal(3, terminal.getAttempts());
    });

    it('is now 4 attempts', () => {
      terminal.replenishAttempts();

      chai.assert.equal(4, terminal.getAttempts());
    });
  });
});
