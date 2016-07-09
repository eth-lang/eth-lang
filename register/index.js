var readFileSync = require('fs').readFileSync;
var eth = require('../eth-lang');

var compilePath = function(path) {
  var source = readFileSync(path, 'utf8');
  return eth.write(eth.read(path, source));
}

// Register the `.eth` file extension so that modules can simply be required.
require.extensions['.eth'] = function(module, filename) {
  module._compile(compilePath(filename), filename);
};
