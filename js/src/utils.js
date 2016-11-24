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
  // Class
  this.visuals = '';

  // Dynamic
  this.interval = 0;
}

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

Utils.prototype.setVisuals = function (visuals) {
  this.visuals = visuals;
};

module.exports = Utils;
