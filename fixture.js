/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var extract = require('esprima-extract-comments');
var extend = require('extend-shallow');

/**
 * Expose `strip`
 */

/* deps: --exclude=foo --include=bar */
module.exports = strip;

/* lint: --exclude=foo --include=bar */
/**
 * Strip both block and line comments from the given `str`.
 *
 * ```js
 * strip('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc '
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `//!` or `/*!` are preserved
 * @return {String} String without block comments.
 * @api public
 */

function strip(str, options) {
  if (!str || str.length === 0) {
    return '';
  }

  try {
    var opts = extend({ safe: false }, options);
    var comments = extract.fromString(str);
    var keys = Object.keys(comments);
    var len = keys.length;
    var i = 0;

    while (i < len) {
      var key = keys[i++];
      var comment = comments[key];

      if (comment.type === 'Line' && typeof opts.block === 'undefined') {
        if (opts.safe === true && comment.value[0] === '!') {
          continue;
        } else {
          comment.value = '//' + comment.value;
        }
        str = str.replace(comment.value, '');
      }

      if (comment.type === 'Block' && typeof opts.line === 'undefined') {
        if (opts.safe === true && comment.value[0] === '!') {
          continue;
        } else {
          comment.value = '/*' + comment.value + '*/';
        }
        str = str.replace(comment.value, '');
      }

    }
  } catch(err) {
    if (opts.silent) return;
    console.log(err)
    throw err;
  }
  return str;
}

/**
 * Strip block comments from the given `str`.
 *
 * ```js
 * strip.block('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc '
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `/*!` are preserved
 * @return {String}
 * @api public
 */

strip.block = function stripBlock(str, options) {
  return strip(str, extend({}, options, {block: true}));
};

/**
 * Strip line comments from the given `str`.
 *
 * ```js
 * strip.line('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc \n/* quux fez *\/'
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `//!` are preserved
 * @return {String}
 * @api public
 */

strip.line = function stripLine(str, options) {
  return strip(str, extend({}, options, {line: true}));
};
