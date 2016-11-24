/**
 * renderer.js v0.2.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/terminal-game/blob/master/LICENSE)
 */

'use strict';

/**
 * Constructor
 */
function Visuals() {
  this.utils    = '';
  this.terminal = '';
}

/**
 * Event Listeners
 *
 * Attaches a mouse over, mouse out, and click event listener to each
 * `$('.text span')` element.
 *
 * Mouse over will determine if the character is a part of a population
 * of important notice (e.g. word, surrounding characters) and add a class
 * that visually shows the nearby characters are grouped for a reason.
 *
 * Mouse out will remove the visual.
 *
 * Click will do the initial discovery that mouse over does and then will
 * determine what occurs afterwards. Resulting in either a replenish, a dud
 * removal, an attempt decrease, a loss, a win, or nothing at all.
 */
Visuals.prototype.attachEventListeners = function () {
  const self = this;

  $(document).on('keydown', function (event) {
    // First, check if it was enter, and if there's something highlighted.
    if (event.which === 13 && $('.text span.is-hover').length > 0) {
      self.processInput();

      return false;
    }

    // Otherwise, if it was not an arrow key, neglect it.
    if ([37, 38, 39, 40].indexOf(event.which) === -1) {
      return false;
    }

    // Either highlight the "origin" of the board, or process where to go.
    if ($('.text span.is-hover').length === 0) {
      self.highlightAdd($('#text-1 > div:first-child > span:first-child'));
    } else {
      const $exact = $('.text span.is-hover[data-exact=true]');
      const $row   = $exact.parent();
      const $text  =   $row.parent();

      // Detect if unable to move left.
      if (event.which === 37 && $exact.is(':first-child') && $text.is('#text-1')) {
        return false;
      }

      // Detect if unable to move up.
      if (event.which === 38 && $row.is(':first-child')) {
        return false;
      }

      // Detect if unable to move right.
      if (event.which === 39 && $exact.is(':last-child') && $text.is('#text-2')) {
        return false;
      }

      // Detect if unable to move down.
      if (event.which === 40 && $row.is(':last-child')) {
        return false;
      }

      // From here, it's assumed the arrow key can move.
      self.highlightRemove($exact);

      // Detect if need to move from `#text-1` to `#text-2`.
      if (event.which === 39 && $exact.is(':last-child') && $text.is('#text-1')) {
        self.highlightAdd($('#text-2 > div:eq(' + $row.data('row') + ') > span').first());

        return false;
      }

      // Detect if need to move from `#text-2` to `#text-1`.
      if (event.which === 37 && $exact.is(':first-child') && $text.is('#text-2')) {
        self.highlightAdd($('#text-1 > div:eq(' + $row.data('row') + ') > span').last());

        return false;
      }

      // Default moving.
      switch (event.which) {
        // The left arrow key.
        case 37:
          let $left = $exact.prev();

          // Skip over the word, rather than go through each letter.
          if ($exact.is('[data-word]') && $left.is('[data-word]')) {
            const $word = $('[data-word="' + $left.data('word') + '"]');

            $left = $word.first().prev();

            // However, if the word is on two lines, do not skip the word.
            if ($left.parent().data('row') !== $exact.parent().data('row')) {
              $left = $exact.prev();
            }

            // Also, if the word is at the beginning of `#text-2`, mimic column shift.
            if ($row.find('> span:first-child').is($word) && $text.is('#text-2')) {
              $left = $('#text-1 > div:eq(' + $row.data('row') + ') > span').last();
            }
          }

          self.highlightAdd($left);
          break;

        // The up arrow key.
        case 38:
          self.highlightAdd($row.prev().find('[data-column="' + $exact.data('column') + '"]'));
          break;

        // The right arrow key.
        case 39:
          let $right = $exact.next();

          // Skip over the word, rather than go through each letter.
          if ($exact.is('[data-word]') && $right.is('[data-word]')) {
            const $word = $('[data-word="' + $right.data('word') + '"]');

            $right = $word.last().next();

            // However, if the word is on two lines, do not skip the word.
            if ($right.parent().data('row') !== $exact.parent().data('row')) {
              $right = $exact.next();
            }

            // Also, if the word is at the end of `#text-1`, mimic column shift.
            if ($row.find('> span:last-child').is($word) && $text.is('#text-1')) {
              $right = $('#text-2 > div:eq(' + $row.data('row') + ') > span').first();
            }
          }

          self.highlightAdd($right);
          break;

        // The down arrow key.
        case 40:
          self.highlightAdd($row.next().find('[data-column="' + $exact.data('column') + '"]'));
          break;
      }
    }
  });

  $('.text span')
    .mouseover(function () {
      $('.text span.is-hover').removeClass('is-hover');

      self.highlightAdd($(this));
    })
    .mouseout(function () {
      self.highlightRemove($(this));
    })
    .click(function () {
      self.processInput();
    });
};

/**
 * Likeness Determiner
 *
 * Determines how many character-by-character matches there are in a given text
 * when compared to the overall password.
 *
 * @param  {String} text -- The given text to cross-reference.
 * @return {Integer}
 */
Visuals.prototype.determineLikeness = function (text) {
  let   likeness = 0;
  const password = this.getTerminal().getPassword();

  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === password.charAt(i)) {
      likeness++;
    }
  }

  return likeness;
};

/**
 * Ending Determiner
 *
 * Determines the ending bracket is located based on the beginning bracket.
 *
 * @param  {String} text -- The text to search.
 * @return {Integer}
 */
Visuals.prototype.endingBracketLocation = function (text) {
  let   bracket  = '';
  const brackets = ['>', ']', '}', ')'];

  switch ($('[data-exact="true"]').text()) {
    case '<':
      bracket = brackets[0];
      break;
    case '[':
      bracket = brackets[1];
      break;
    case '{':
      bracket = brackets[2];
      break;
    case '(':
      bracket = brackets[3];
      break;
  }

  const isBrace   = bracket === bracket[2];
  const isParen   = bracket === bracket[3];
  const isBracket = bracket === bracket[1];
  const isGreater = bracket === bracket[0];

  // Run through each character within the text, cross-reference with all
  // ending brackets.
  for (let i = 0; i < text.length; i++) {
    // There has to be a better way to optimize this.
    if (text.charAt(i) === bracket[0] && isGreater) {
      return i;
    } else if (text.charAt(i) === bracket[1] && isBracket) {
      return i;
    } else if (text.charAt(i) === bracket[2] && isBrace) {
      return i;
    } else if (text.charAt(i) === bracket[3] && isParen) {
      return i;
    }
  }

  return -1;
};

/**
 * Determines if the highlighted element has any notable relatives nearby.
 *
 * @param  {Element} element -- The initial highlighted element.
 * @return {Element or NodeList}
 */
Visuals.prototype.getPopulation = function ($element) {
  if (this.isBeginningBracket($element) && $element.attr('data-skip') === undefined) {
    return this.locateEnding($element);
  } else if ($element.is('[data-word]')) {
    return $('span[data-word="' + $element.data('word') + '"]');
  } else {
    return $element;
  }
};

/**
 * Highlight Addition
 *
 * Adds a visual highlight of the character(s) selected.
 *
 * @param {Element} $element -- The current element.
 */
Visuals.prototype.highlightAdd = function ($element) {
  // Add our exact location.
  $element.attr('data-exact', true);

  // Determine if we have any friends.
  const $population = this.getPopulation($element);

  // Add the hovering to whomever is applicable.
  $population.addClass('is-hover');

  // Alert the entry of new text.
  $('#entry').html($population.text());
};

/**
 * Highlight Remover
 *
 * Removes a highlight from the current character(s) selected.
 *
 * @param {Element} $element -- The current element.
 */
Visuals.prototype.highlightRemove = function ($element) {
  // Remove our exact location.
  $element.removeAttr('data-exact');

  // Remove any traces that we were here.
  $('.text span.is-hover').removeClass('is-hover');

  // Even... even the entry.
  $('#entry').html('');
};

/**
 * Beginning Bracket Determiner
 *
 * Determines if the element is a beginning bracket.
 *
 * @param  {Element} $element -- The element being scanned.
 * @return {Boolean}
 */
Visuals.prototype.isBeginningBracket = function ($element) {
  return ['<', '[', '{', '('].indexOf($element.text()) > -1;
};

/**
 * Ending Locater
 *
 * Locates the ending of a surrounding block character within a row.
 *
 * @param  {Element} $element -- The current element in suspicion.
 * @return {Element}
 */
Visuals.prototype.locateEnding = function ($element) {
  const $row  = $element.parent();
  const index = this.endingBracketLocation($row.text());

  // If the row does not have the ending, return itself.
  if (index === -1) {
    return $element;
  }

  // Otherwise, return all the grouped elements.
  return $row.find('> span').slice($element.index(), index + 1);
};

/**
 * Printer
 *
 * Writes text to the output column while deleting the upper-most `<p>` element
 * to maintain visual appeal.
 *
 * @param {String} text -- The text to print.
 */
Visuals.prototype.print = function (text) {
  $('<p>&gt;' + text + '</p>').insertBefore($('#results > p:eq(14)'));

  $('#results > p:eq(0)').remove();
};

/**
 * Processor
 *
 * Processes the selected character(s) and determines what to do.
 */
Visuals.prototype.processInput = function () {
  const $exact      = $('[data-exact="true"]');
  const password    = this.terminal.getPassword();
  const $population = this.getPopulation($exact);

  if (this.isBeginningBracket($exact) && $population.length > 1) {
    let output = '';

    if ($exact.is('[data-replenishes]')) {
      // Replenish attempts, internally.
      this.terminal.replenishAttempts();

      // Replenish attempts, visually.
      this.renderer.renderAttempts(this.terminal.getAttempts());

      // Alert the user on what just happened.
      output = 'Tries reset.';
    } else {
      let words    = this.terminal.getWords();
      let stopper  = 0;
      let removing = '';

      while (true) {
        const number = this.utils.pickRange(0, words.length);
        // Pick a random word.
        removing = words[number];

        // Do not pick the password.
        if (removing !== password) {
          // Remove the word from being able to be picked again.
          words.splice(number, 1);

          // Set the words back in the terminal class.
          this.terminal.setWords(words);

          break;
        }

        stopper++;

        if (stopper === 20) {
          this.utils.warner('Visuals.prototype.processInput stopper.');

          break;
        }
      }

      // Remove the word visually.
      $('span[data-word="' + removing + '"]')
        .text('.')
        .removeAttr('data-word');

      // Aler the user on what just happened.
      output = 'Dud removed.';
    }

    this.getRenderer().print($population.text().toUpperCase());
    this.getRenderer().print(output);

    // Remove just the multiple items of hover.
    $population.removeClass('is-hover');

    // Remove this from being selected again.
    $exact
      .addClass('is-hover')
      .attr('data-skip', true)
      .removeAttr('data-replenishes');
  }

  if ($exact.is('[data-word]')) {
    if ($population.text() === password) {
      // TODO: Something better.
      this.getRenderer().print($population.text().toUpperCase());
      this.getRenderer().print('Entry granted.');

      $('.text span').off('click');
      $(document).off('keydown');
    } else {
      // Decrease attempts, internally.
      this.getTerminal().decreaseAttempt();

      // Decrease attempts, visually.
      $('#attempts > .attempt:last-child').remove();

      // Render the output.
      this.getRenderer().print($population.text().toUpperCase());
      this.getRenderer().print('Entry denied.');
      this.getRenderer().print('Likeness=' + this.determineLikeness($population.text()));

      // Player has failed to hack into the terminal.
      if (this.getTerminal().getAttempts() === 0) {
        // TODO: Something better.
        this.getRenderer().print('Locked out.');

        $('.text span').off('click');
        $(document).off('keydown');
      }
    }
  }
};

/**
 * Text Displayer
 *
 * In a visually appealing way, write the text letter-by-letter as if
 * it were to look like an older machine typing.
 *
 * @reference: http://jsfiddle.net/VZvK7/
 *
 * @param {Element} $element -- The element that'll have the text.
 * @param {String}  text     -- The text to be displayed.
 * @param {Integer} index    -- The current location in the text.
 * @param {Integer} interval -- Interval for the next text.
 */
Visuals.prototype.showText = function ($element, text, index, interval) {
  if (index > text.length) {
    return;
  }

  // Default milliseconds for text.
  if (interval === undefined) {
    interval = 30;
  }

  // setTimeout loses scope definition.
  const self = this;

  // Assure text is a string.
  text = text.toString();

  // The append must be inside for the initial calls.
  // This way the index does not have three billion callbacks.
  setTimeout(function () {
    $element.append(text.charAt(index++));

    self.showText($element, text, index);
  }, interval);
};

/**
 * Accessors
 */
Visuals.prototype.getTerminal = function () {
  return this.terminal;
};

Visuals.prototype.getUtils = function () {
  return this.utils;
};

/**
 * Mutators
 */
Visuals.prototype.setTerminal = function (terminal) {
  this.terminal = terminal;
};

Visuals.prototype.setUtils = function (utils) {
  this.utils = utils;
};
