var Promise = require('promise-polyfill');

var __eth__module = {
  create: function(fn) {
    return new Promise(fn);
  },
  then: function(p, success, error) {
    return p.then(success, error);
  },
  Promise: Promise,
  resolve: Promise.resolve,
  reject: Promise.reject,
  all: Promise.all,
  race: Promise.race,
};
if (module && module.exports) {
  module.exports = __eth__module;
}
if (typeof window !== 'undefined') {
  window['eth/promise'] = __eth__module;
}
