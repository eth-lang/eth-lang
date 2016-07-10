module.exports = {
  entry: [
    './ast.js',
    './core/index.js',
    './promise/index.js',
    './testing/index.js',
    './eth.js',
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
