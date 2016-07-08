var ast = require('./ast');
var core = require('ramda');

core.print = function() {
  var args = Array.prototype.slice.call(arguments);
  console.log.apply(console.log, args);
};

core.fromJson = function(string) {
  return JSON.parse(string);
};

core.toJson = function(value) {
  return JSON.stringify(value);
};

// Ensure ramda functions often used in macros are 'list' aware
//
var _prepend = core.prepend;
core.prepend = core.curryN(2, function(x, xs) {
  var result = _prepend(x, xs);
  if (ast.isList(xs)) {
    return ast.list.apply(null, result);
  }
  return result;
});

var _map = core.map;
core.map = core.curryN(2, function(f, xs) {
  var result = _map(f, xs);
  if (ast.isList(xs)) {
    return ast.list.apply(null, result);
  }
  return result;
});

module.exports = core;
