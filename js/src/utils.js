/**
 * utils.js v0.1.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Utils() {

}

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

module.exports = Utils;
