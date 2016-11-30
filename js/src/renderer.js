/**
 * renderer.js v0.3.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Renderer() {
  // Classes
  this.utils = '';
}

/**
 * Render: Attempts
 *
 * Renders the attempts section of the page.
 */
Renderer.prototype.renderAttempts = function () {
  const $attempt = $('#info-attempt > span[data-text]');

  this.utils.frontRender($attempt, $attempt.data('text'));

  for (let i = 0; i < 4; i++) {
    this.timeoutAppend($('#attempts'), '<span class="attempt">&nbsp;</span>');

    this.utils.increaseInterval(50);
  }
};

/**
 * Render: Board
 *
 * Renders the main board of the page.
 *
 * @param {Array}   board    -- The array-mirror of the board.
 * @param {Array}   pointers -- The visuals pointers on the board.
 * @param {Integer} rows     -- Amount of rows on the board.
 * @param {Integer} columns  -- Amount of columns on the board.
 */
Renderer.prototype.renderBoard = function (board, pointers, rows, columns) {
  for (let i = 0; i < rows; i++) {
    // Render column 1.
    $('#pointer-1').append('<span></span>');
    this.utils.frontRender($('#pointer-1 > span').eq(i), pointers[i]);

    // Render column 2.
    $('#text-1').append('<div></div>');
    let $row = $('#text-1 > div').eq(i);

    for (let x = 0; x < columns; x++) {
      // Grab the element.
      const $temp = $(board[i][x]);
      const text  = $temp.text();

      // Remove the interior.
      $temp.text('');
      $row.append($temp);

      // Render it when ready.
      this.utils.frontRender($temp, text);
    }

    // Render column 3.
    $('#pointer-2').append('<span></span>');
    this.utils.frontRender($('#pointer-2 > span').eq(i), pointers[i + rows]);

    // Render column 4.
    $('#text-2').append('<div></div>');
    $row = $('#text-2 > div').eq(i);

    for (let x = 0; x < columns; x++) {
      // Grab the element.
      const $temp = $(board[i + rows][x]);
      const text  = $temp.text();

      // Remove the interior.
      $temp.text('');
      $row.append($temp);

      // Render it when ready.
      this.utils.frontRender($temp, text);
    }
  }
};

/**
 * Render: Information
 *
 * Renders the information header of the page.
 *
 * @param {Object} platform -- Third-party library.
 */
Renderer.prototype.renderInformation = function (platform) {
  // Scope definition.
  const self = this;

  $('#information > p[data-text]').each(function () {
    self.utils.frontRender($(this), $(this).data('text'));

    if ($(this).is(':first-child')) {
      self.renderTablet(platform);
    }
  });
};

/**
 * Render: Results
 *
 * Renders the results column of the page.
 *
 * @param {Integer} rows -- Amount of rows on the board.
 */
Renderer.prototype.renderResults = function (rows) {
  for (let i = 0; i < rows; i++) {
    if (i + 1 === rows) {
      this.timeoutAppend($('#results'), '<p>&gt;<span class="entry" id="entry"></span></p>');
    } else {
      $('#results').append('<p>&nbsp;</p>');
    }
  }
};

/**
 * Render: Tablet
 *
 * Renders the tablet information within the information part of the page.
 *
 * @param {Object} platform -- Third-party library.
 */
Renderer.prototype.renderTablet = function (platform) {
  // TODO: Detect Android tablets.
  const tablets = ['iPad', 'Kindle', 'Kindle Fire'];

  // Alert tablet users the arrow functionality is "broken".
  // TODO: Detect if keyboard is connected to Tablet.
  if (tablets.indexOf(platform.product) > -1) {
    const $alert = $('<p data-text="!! Warning !!"></p>');
    const $limit = $('<p data-text="External Keyboard Not Found. Limited Usage Probable."></p>');

    $alert.insertAfter($('#information > p:first-child'));
    $limit.insertAfter($('#information > p:eq(1)'));

    $('#information > p:eq(1), #information > p:eq(2)').each(function () {
      this.utils.frontRender($(this), $(this).data('text'));
    });
  }
};

/**
 * setTimeout
 *
 * Creates a `setTimeout` function within a loop. Once time is done, it appends
 * text to an element.
 *
 * @param {Element} $element -- The element being handled.
 * @param {String}  append   -- The text being appended.
 */
Renderer.prototype.timeoutAppend = function ($element, append) {
  setTimeout(function () {
    $element.append(append);
  }, this.utils.getInterval());
};

/**
 * Mutators
 */
Renderer.prototype.setUtils = function (utils) {
  this.utils = utils;
};
