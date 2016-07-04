var Promise = require('promise-polyfill');

module.exports = {
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
if (typeof window !== 'undefined') {
  window['eth/promise'] = module.exports;
}
