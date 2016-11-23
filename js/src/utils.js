/**
 * utils.js v0.2.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Utils() {
  this.interval = 0;
}

/**
 * Interval Increase
 *
 * Increases the interval based on the given integer. The increase is within
 * parentheses to assure that math is done first.
 *
 * @param {Integer} increase -- How much to increase.
 */
Utils.prototype.increaseInterval = function (increase) {
  this.setInterval(this.getInterval() + (increase));
};

/**
 * Logger
 *
 * @param  {String} text -- Text to log.
 * @return {Console}
 */
Utils.prototype.logger = function (text) {
  return console.log('[' + new Date().toLocaleString() + '] => ' + text);
};

/**
 * Utility function to randomly generate a number within a range.
 *
 * @param  {Integer} min -- The minimum of the range.
 * @param  {Integer} max -- The maximum of the range.
 * @return {Integer}
 */
Utils.prototype.randomNumberWithinRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Warning
 *
 * Same as the logger, just throws a warning.
 *
 * @param  {String} text -- Text to log.
 * @return {Console}
 */
Utils.prototype.warner = function (text) {
  return console.warn('[' + new Date().toLocaleString() + '] => ' + text);
};

/**
 * Accessors
 */
Utils.prototype.getInterval = function () {
  return this.interval;
};

/**
 * Mutators
 */
Utils.prototype.setInterval = function (interval) {
  this.interval = interval;
};

module.exports = Utils;
