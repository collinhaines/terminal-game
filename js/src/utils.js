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
  this.setInterval(this.interval + (increase));
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
