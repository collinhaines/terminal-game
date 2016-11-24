/**
 * utils.js v0.3.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Utils() {
  // Class
  this.visuals = '';

  // Dynamic
  this.interval = 0;
}

/**
 * Pointer Converter
 *
 * Converts an integer to a hexadecimal string.
 *
 * @param  {Integer} pointer -- The pointer to convert.
 * @return {String}
 */
Utils.prototype.convertPointerToHexadecimal = function (pointer) {
  // Convert to hexadecimal.
  const convert = pointer.toString(16).toUpperCase();

  // Grab the last three characters.
  if (convert.length > 3) {
    return convert.substring(convert.length - 3, convert.length);
  }

  return convert;
};

/**
 * Render Helper
 *
 * Renders text on the board and increases the interval accordingly.
 *
 * @param {Element} $element -- Element the text is going in.
 * @param {String}  text     -- Text the element will have.
 */
Utils.prototype.frontRender = function ($element, text) {
  this.visuals.showText($element, text, 0, this.interval);

  this.increaseInterval(text.length * 30);
};

/**
 * Pointer Generator
 *
 * Generates an initial pointer the board will start at.
 *
 * @return {Integer}
 */
Utils.prototype.generateInitialPointer = function () {
  let pointer = 0;
  let stopper = 0;

  // If the pointer is below 256, the length of `.toString(16)` is 2.
  // Why? Go to France around the year 770 and ask them.
  while (pointer < 256) {
    pointer = Math.floor(Math.random() * parseInt(Math.random().toString().substring(2, 6), 10));

    if (stopper++ === 20) {
      this.warner('Utils.prototype.generateInitialPointer stopper.');

      break;
    }
  }

  return pointer;
};

/**
 * Determiner
 *
 * Determines if the given string has letters within it.
 *
 * @param  {String}  text -- The string to search.
 * @return {Boolean}
 */
Utils.prototype.hasText = function (text) {
  return text.match(/[a-z]/i) !== null;
};

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
Utils.prototype.pickRange = function (min, max) {
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

Utils.prototype.setVisuals = function (visuals) {
  this.visuals = visuals;
};

module.exports = Utils;
