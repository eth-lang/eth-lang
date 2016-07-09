var ast = require('../ast');
var core = require('ramda');

core.assert = function assert(condition, message) {
  if (!condition) {
    throw new Error('assertion error: ' + message);
  }
};

core.print = function print() {
  var args = Array.prototype.slice.call(arguments);
  console.log.apply(console, args);
};

core.fromJson = function fromJson(string) {
  return JSON.parse(string);
};

core.toJson = function toJson(value) {
  return JSON.stringify(value);
};

// Like `assoc` but still returns array when passed numeric keys
function arraySafeAssoc(key, value, target) {
    core.assert(
        Array.isArray(target) || (typeof target === 'object'),
        'arraySafeAssoc: target must be of type array or object got "' + typeof target + '"'
    );
    core.assert(
        core.contains(typeof key, ['number', 'string']),
        'arraySafeAssoc: key must be of type string or number'
    );

    const newTarget = core.clone(target);
    newTarget[key] = value;
    return newTarget;
}

// Takes a object and a path (array of keys) and return the value at the
// specified path in the object or null if non-existant
// (get-in {:a {:b 5}} [:a :b]) -> 5
core.getIn = function getIn(path, target) {
  return core.reduce(function (ret, k) {
    return ret && (k in ret) ? ret[k] : null;
  }, target, path);
};

// Returns a clone of the target with value set at the specified path (array
// of keys). Creates empty objects as necessary to get to path location.
core.setIn = core.curryN(3, function setIn(path, value, target) {
    core.assert(Array.isArray(path), 'setIn: path must be array');
    core.assert(path.length > 0, 'setIn: path length must be > 0');
    core.assert(typeof target === 'object', 'setIn: target must be an object');

    // Recursion end condition
    if (path.length === 1) {
        return arraySafeAssoc(path[0], value, target);
    }

    // Recurse removing one key from the path
    return arraySafeAssoc(
        path[0],
        core.setIn(path.slice(1), value, target[path[0]] || {}),
        target
    );
});

core.updateIn = core.curryN(3, function updateIn(path, updater, target) {
  return core.setIn(path, updater(core.getIn(path, target)), target);
});

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
