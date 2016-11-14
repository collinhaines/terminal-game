/**
 * terminal.js v0.2.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

const chai     = require('chai');
const Utils    = require('../js/src/utils.js');
const Terminal = require('../js/src/terminal.js');

describe('Terminal', () => {
  const utils    = new Utils();
  const terminal = new Terminal();

  describe('constructor', () => {
    terminal.setUtils(utils);

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

  describe('password', () => {
    it('is now randomly generated', () => {
      terminal.setDifficulty(terminal.generateDifficulty());

      chai.assert.oneOf(terminal.getDifficulty(), ['four', 'six', 'eight']);
    });
  });

  describe('pointers', () => {
    it('can be generated', () => {
      chai.assert.notEqual([], terminal.generatePointers());
    });
  });

  describe('words', () => {
    it('has words now', () => {
      const response = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../words.json')).toString());

      terminal.setWords(terminal.generateWords(response));

      chai.assert.notEqual(0, terminal.getWords().length);
    });

    it('has password now', () => {
      terminal.setPassword(terminal.generatePassword());

      chai.assert.notEqual('', terminal.getPassword());
    });
  });
});
