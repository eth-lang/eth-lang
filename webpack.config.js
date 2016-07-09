module.exports = {
  entry: [
    './eth.js',
    './ast.js',
    './core/index.js',
    './promise/index.js',
    './testing/index.js'
  ],
  output: {path: './website', filename: 'eth.js'},
  externals: {
    'eth': 'eth',
    'eth/ast': 'eth.ast',
    'eth/core': 'eth.core',
  },
  target: 'web',
  cache: false
};
