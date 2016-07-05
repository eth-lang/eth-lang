// globals {{{
var GLOBAL = typeof window !== 'undefined' ? window : global;
GLOBAL.__eth__macros = GLOBAL.__eth__macros || {};

var BINARY_OPERATORS = {
  '+': '+',
  '-': '-',
  '/': '/',
  '*': '*',
  '%': '%',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
  '==': '===',
  '!=': '!==',
  '||': '||',
  '&&': '&&',
  'in': 'in',
  'instanceof': 'instanceof'
};

var UNARY_OPERATORS = {
  '!': '!',
  'void': 'void',
  'typeof': 'typeof',
  'delete': 'delete'
};

var READER_EOF = '__eth__reader__eof';
// }}}

// ast {{{
function EthList(items) {
  var arr = [];
  arr.push.apply(arr, items);
  arr.__proto__ = EthList.prototype;
  return arr;
}
EthList.prototype = new Array();

function list() {
  return new EthList(Array.prototype.slice.call(arguments));
}

function symbol(name) {
  return '\uFEFF\'' + name;
}

function isList(v) {
  return v instanceof EthList;
}

function isArray(v) {
  return !(v instanceof EthList) && Array.isArray(v);
}

function isObject(v) {
  return !isList(v) && !isArray(v) && typeof v === 'object';
}

function isSymbol(v) {
  return typeof v === 'string' && v.length > 2 && v[0] === '\uFEFF' && v[1] === '\'';
}

function isKeyword(v) {
  return typeof v === 'string' && v.length > 1 && v[0] === '\uA789';
}

function isString(v) {
  return !isSymbol(v) && !isKeyword(v) && typeof v === 'string';
}

function isNumber(v) {
  return typeof v === 'number';
}

function symbolName(v) {
  return v.slice(2);
}

function keywordName(v) {
  return v.slice(1);
}
// }}}

// helpers {{{
function assert(node, cond, message) {
  if (!cond) {
    throw new Error('assertion error: ' + message + ' (evaluating: "' + print(node) + '")');
  }
}

function unescapeString(str) {
  var escapes = {b: '\b', f: '\f', n: '\n', r: '\r', t: '\t'};

  return str.replace(/\\x([a-f0-9]{2})/i, function (_, hexAsciiCode) {
    // Handle "hex" 256 ascii codes
    return String.fromCharCode(parseInt(hexAsciiCode, 16));
  }).replace(/\\(u[0-9a-f]{4}|[^u])/i, function(_, escape) {
    // Handle unicode chars
    var type = escape.charAt(0);
    var hex = escape.slice(1);
    if (type === 'u') return String.fromCharCode(parseInt(hex, 16));

    // Handle special whitespace characters
    if (escapes.hasOwnProperty(type)) return escapes[type];

    // Handle others (" \ ...)
    return type;
  });
}

function escapeString(str) {
  str = str.replace('"', '\\"');
  str = str.replace('\\', '\\\\');
  str = str.replace('\b', '\\b');
  str = str.replace('\f', '\\f');
  str = str.replace('\n', '\\n');
  str = str.replace('\r', '\\r');
  str = str.replace('\t', '\\t');
  return str;
}

function escapeSymbol(name) {
  if (name === '@') return 'this';
  if (name[0] === '@') return 'this.' + escapeSymbol(name.slice(1));
  if (name.endsWith('.')) return 'new ' + escapeSymbol(name.slice(0, -1));
  if (name.endsWith('!')) name = name.slice(0, -1) + '$';
  if (name.endsWith('?')) name = 'is-' + name.slice(0, -1);

  // turn dashed to camel case form
  return name.replace(/-(.)/g, function(_, groupOne) {
    return groupOne.toUpperCase();
  });
}

function astMapNode(callback, node) {
  if (isList(node) || isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      node[i] = astMapNode(callback, node[i]);
    }
  }
  if (isObject(node)) {
    var keys = Object.keys(node);
    for (var i = 0; i < keys.length; i++) {
      node[keys[i]] = astMapNode(callback, node[keys[i]]);
    }
  }
  return callback(node);
}

function astMap(callback, ast) {
  return ast.map(astMapNode.bind(null, callback));
}

function apply(fn, args) {
  return fn.apply(null, args);
}

function concat(l1, l2) {
  return l1.concat(l2);
}
// }}}

// tokenize {{{
function tokenizeCode(x) {
  x = x.replace(/\(/g, ' ( ');
  x = x.replace(/\)/g, ' ) ');
  x = x.replace(/\[/g, ' [ ');
  x = x.replace(/\]/g, ' ] ');
  x = x.replace(/\{/g, ' { ');
  x = x.replace(/\}/g, ' } ');
  return x;
}

function tokenizeString(x) {
  // Support multi line strings
  x = x.replace('\n', '\\n');
  // Replace whitespace in strings for now so it's not counted as token split
  x = x.replace(/ /g, '!whitespace!');
  return x;
}

function tokenizePart(x, i) {
  if (i % 2 === 0) {
    return tokenizeCode(x);
  } else {
    return tokenizeString(x);
  }
}
function tokenize(source) {
  // Replace exacped quote for later (so the don't interfer with the string split)
  source = source.replace('\\"', '!backquote!');

  // String comments
  source = source.replace(/;[^\n]+\n/g, '');

  // Split on '"' and parse strings, or expressions depending if we are within
  // quotes or not
  source = source.split('"').map(tokenizePart).join('"').trim();

  // We can now define tokens as all separated by whitespace
  return source.split(/\s+/).map(function(x) {
    return x.replace(/!whitespace!/g, ' ').replace('!backquote!', '"');
  });
}
// }}}

// read {{{
function readerError(tokens, index, message) {
  return new Error('reader error: ' + message + tokens.slice(index, index + 15).join(' '));
}

// Takes an array of tokens and build up the ast
var readerIndex = 0;
var readerTokens = [];
function read() {
  if (readerIndex >= readerTokens.length) {
    return READER_EOF;
  }

  var startIndex = readerIndex;
  var token = readerTokens[readerIndex];

  var node;

  function readList(name, endToken, addFn) {
    readerIndex++; // skip start token
    while (readerTokens[readerIndex] !== endToken) {
      var childNode = read();
      if (childNode === READER_EOF) {
        throw readerError(readerTokens, startIndex, 'unterminated ' + name + ' starting at: ');
      }
      addFn(childNode);
    }
    readerIndex++; // skip end token
  }

  // list ()
  if (readerTokens[readerIndex] === '(') {
    node = new EthList();
    readList('list', ')', function(childNode) { node.push(childNode); });
    return node;
  }

  // array []
  if (readerTokens[readerIndex] === '[') {
    node = [];
    readList('array', ']', function(childNode) { node.push(childNode); });
    return node;
  }

  // object {}
  if (readerTokens[readerIndex] === '{') {
    node = {};
    var lastKey;
    readList('object', '}', function(childNode) {
      if (((readerIndex - startIndex) % 2) === 0) {
        // keep key
        lastKey = childNode;
      } else {
        // set value to key
        node[lastKey] = childNode;
      }
    });
    if (((readerIndex - startIndex) % 2) !== 0) {
      throw readerError(readerTokens, startIndex, "object literal given an un even amount of keys and values starting at:");
    }
    return node;
  }


  // number 1.23
  if (/^-?\d+\.?\d*$/.test(token)) {
    readerIndex++;
    return token.indexOf('.') > -1
      ? parseFloat(token, 10)
      : parseInt(token, 10);
  }

  // string "abc"
  if (token.length >= 2 && token[0] === '"' && token[token.length-1] === '"') {
    readerIndex++;
    return unescapeString(token.slice(1, -1));
  }

  // keyword :key-one
  if (token.length > 1 && token[0] === ':') {
    readerIndex++;
    return '\uA789' + token.slice(1);
  }

  // symbol abc
  readerIndex++;
  return '\uFEFF\'' + token;
}

// Read source and follows requires converting it all to ast
function ethRead(filename, sourceCode) {
  if (!sourceCode && sourceCode !== '' && filename) {
    sourceCode = filename;
    filename = 'unknown';
  }
  // tokenize & read ast
  readerIndex = 0;
  readerTokens = tokenize(sourceCode);
  var ast = [];
  while (readerIndex < readerTokens.length) {
    var node = read();
    if (node === READER_EOF) {
      break;
    }
    ast.push(node);
  }

  ast = expandSyntax(ast);

  ast = expandMacros(ast);

  return ast;
}
// }}}

// expand {{{
function expandSyntax(ast) {
  return ast;
}

// Take any ast node call it's expader if it's list starting with a registered macro
function expandMacro(state, node) {
  if (isList(node) && node.length > 0 && isSymbol(node[0])) {
    var macro = GLOBAL.__eth__macros[symbolName(node[0])];
    if (macro) {
      state.foundMacro = true;
      return macro.apply(null, node.slice(1));
    }
  }
  return node;
}

// Call expandMacro on every ast node to repetition until the ast doesn't change anymore
function expandMacros(ast) {
  var state = {foundMacro: true};
  while (state.foundMacro) {
    state.foundMacro = false;
    ast = astMap(expandMacro.bind(null, state), ast);
  }
  return ast;
}

function installMacro(name, expander) {
  GLOBAL.__eth__macros[name] = expander;
}

installMacro('defn', function (name, params) {
  var body = Array.prototype.slice.call(arguments, 2);
  return list(symbol('def'), name, apply(list, concat([symbol('fn'), name, params], body)));
});
// }}}

// write {{{
function writeList(node) {
  // empty list is null `()`
  if (node.length === 0) {
    return 'null';
  }

  if (!isSymbol(node[0])) {
    throw new Error('write: given list that isn\'t starting with a symbol: ' + print(node));
  }
  var calee = symbolName(node[0]);

  if (BINARY_OPERATORS[calee]) {
    assert(node, node.length === 3, 'binary operator "' + BINARY_OPERATORS[calee]
      + '" needs exactly 2 arguments, got ' + node.length-1);
    return '(' + [write(node[1]), BINARY_OPERATORS[calee], write(node[2])].join(' ') + ')';
  }
  return '()';
}

function write(node) {
  if (isNumber(node)) {
    return String(node);
  }
  if (isString(node)) {
    return '"' + escapeString(node) + '"';
  }
  if (isKeyword(node)) {
    return '"' + escapeSymbol(keywordName(node)) + '"';
  }
  if (isSymbol(node)) {
    return escapeSymbol(symbolName(node));
  }
  if (isObject(node)) {
    return '{' + Object.keys(node).map(function(k) {
      return write(k) + ': ' + write(node[k]);
    }).join(', ') + '}';
  }
  if (isArray(node)) {
    return '[' + node.map(write).join(', ') + ']';
  }
  if (isList(node)) {
    return writeList(node);
  }
  throw new Error('write: unhandled ast node type: ' + print(node));
}

// Write out transpiled JS code
function ethWrite(ast) {
  return ast.map(write).join('\n') + '\n';
}
// }}}

// eval {{{
// Eval ast from a given env
function ethEval(context, ast) {
  return require('vm').createScript(write('', ast), {
    filename: 'eval',
    showErrors: false
  }).runInContext(context);
}
// }}}

// print {{{
function print(node) {
  if (isList(node)) {
    return '(' + node.map(print).join(' ') + ')';
  }
  if (isArray(node)) {
    return '[' + node.map(print).join(' ') + ']';
  }
  if (isObject(node)) {
    return '{' + Object.keys(node).map(function(k) {
      return print(k) + ' ' + print(node[k]);
    }).join(' ') + '}';
  }
  if (isSymbol(node)) {
    return symbolName(node);
  }
  if (isKeyword(node)) {
    return ':' + keywordName(node);
  }
  if (isString(node)) {
    return '"' + escapeString(node) + '"';
  }
  return String(node);
}

// Write out lisp value
function ethPrint(ast) {
  return ast.map(print).join('\n');
}
// }}}

var __eth__module = {
  read: ethRead,
  eval: ethEval,
  print: ethPrint,
  write: ethWrite,
};
if (module && module.exports) {
  module.exports = __eth__module;
}
if (typeof window !== 'undefined') {
  window['eth'] = __eth__module;
}
