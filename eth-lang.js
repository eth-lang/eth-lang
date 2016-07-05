// globals {{{
var GLOBAL = typeof window !== 'undefined' ? window : global;
GLOBAL.__eth__macros = GLOBAL.__eth__macros || {};
GLOBAL.__eth__installMacro = installMacro;
var COMPILER_CONTEXT = require('vm').createContext({
  require: require,
  __eth__installMacro: GLOBAL.__eth__installMacro
});

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

var MACRO_SYNTAX = {
  '\'': 'quote',
  '`': 'quasi-quote',
  '~': 'unquote',
  '~@': 'unquote-splicing'
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
  return !isList(v) && !isArray(v) && v !== null && typeof v === 'object';
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

function isSymbolList(v) {
  if (!isList(v)) {
    return false;
  }
  return v.reduce(function(a, s) { return a && isSymbol(s); }, true);
}

function symbolName(v) {
  return v.slice(2);
}

function keywordName(v) {
  return v.slice(1);
}

function name(v) {
  if (isSymbol(v)) return symbolName(v);
  if (isKeyword(v)) return keywordName(v);
  if (isString(v)) return v;
  throw new Error('name: unhandle name type, got:' + v);
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
  if (name.endsWith('?')) {
    var parts = name.split('.');
    var newName = 'is-' + parts[parts.length-1].slice(0, -1);
    name = parts.slice(0, -1).concat([newName]).join('.');
  }

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
  x = x.replace(/'/g, ' \' ');
  x = x.replace(/`/g, ' ` ');
  x = x.replace(/~/g, ' ~ ');
  x = x.replace(/~@/g, ' ~@ ');
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


  // quote `'`, quasi-quote ```, unquote `~`, unquote-splicing `~@`
  if (Object.keys(MACRO_SYNTAX).indexOf(token) > -1) {
      readerIndex++;
      var childNode = read();
      if (childNode === READER_EOF) {
        throw readerError(readerTokens, startIndex, 'unterminated ' + name + ' starting at: ');
      }
      return list(symbol(MACRO_SYNTAX[token]), childNode);
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

installMacro('import', function (package, aliasOrImports) {
  var node;
  if (!aliasOrImports) {
    assert(package, isSymbol(package), 'import: package name needs to be a symbol when importing and not aliasing');
    node = list(symbol('def'), package, list(symbol('require'), name(package)));
  } else if (isSymbol(aliasOrImports)) {
    node = list(symbol('def'), aliasOrImports, list(symbol('require'), name(package)));
  } else if (isSymbolList(aliasOrImports)) {
    var defNodes = [symbol('def')];
    for (var i = 0; i < aliasOrImports.length; i++) {
      defNodes.push(aliasOrImports[i]);
      defNodes.push(list('get', list(symbol('require'), name(package)), aliasOrImports[i]));
    }
    node = apply(list, defNodes);
  } else {
    assert(list(symbol('import'), package, aliasOrImports), false, 'import: invalid import usage, need package name and optionally an alias or imports');
  }

  // here we want to have access to those imports right away (for other macros), hence
  // let's write out that ast and eval it now
  ethEval(COMPILER_CONTEXT, [node]);

  return node;
});

installMacro('defmacro', function (name, params) {
  var globalCode = '__eth__installMacro';
  var body = Array.prototype.slice.call(arguments, 2);
  var node = list(symbol(globalCode), symbolName(name), apply(list, concat([symbol('fn'), params], body)));

  // here we want to have access to that macro right away (for other macros), hence
  // let's write out that ast and eval it now
  ethEval(COMPILER_CONTEXT, [node]);

  return node;
});
// }}}

// write {{{
function writeBody(body) {
  if (body.length === 0) {
    return 'return (void 0);';
  }
  return body.slice(0, -1).map(write).join('; ')
    + (body.length > 1 ? '; ' : '') + 'return '
    + write(body[body.length - 1]) + ';';
}

function writeList(node) {
  // empty list is null `()`
  if (node.length === 0) {
    return 'null';
  }

  if (!isSymbol(node[0])) {
    throw new Error('lists need their first arguments to be a symbol, got: ' + print(node[0]));
  }
  var calee = symbolName(node[0]);

  // binary opreator
  if (BINARY_OPERATORS[calee]) {
    assert(node, node.length === 3, 'binary operator "' + BINARY_OPERATORS[calee]
      + '" needs exactly 2 arguments, got: ' + print(node));
    return '(' + [write(node[1]), BINARY_OPERATORS[calee], write(node[2])].join(' ') + ')';
  }

  // unary operator
  if (UNARY_OPERATORS[calee]) {
    assert(node, node.length === 2, 'unary operator "' + UNARY_OPERATORS[calee]
      + '" needs exactly 1 arguments, got: ' + print(node));
    return '(' + UNARY_OPERATORS[calee] + ' ' + write(node[1]) + ')';
  }

  // def/var
  if (calee === 'def') {
    assert(node, (node.length % 2) === 1, '"def" needs an even number arguments (name & value pairs), got: ' + (node.length - 1));
    var assignments = [];
    for (var i = 1; i < node.length; i += 2) {
      assert(node, isSymbol(node[i]), '"def" needs it\'s name arguments to be symbols, got: ' + print(node[i]));
      assignments.push(write(node[i]) + ' = ' + write(node[i+1]));
    }
    return 'var ' + assignments.join(',\n    ');
  }

  // set/=
  if (calee === 'set') {
    assert(node, node.length === 3, '"set" needs exactly 2 arguments (name, value), got: ' + (node.length - 1));
    assert(node, isSymbol(node[1]), '"set" needs it\'s first argument to be a symbol, got: ' + print(node[1]));
    return write(node[1]) + ' = ' + write(node[2]);
  }

  // fn/function
  if (calee === 'fn') {
    var name = '';
    var params = node[1];
    var body = node.slice(2);
    if (isSymbol(node[1])) {
      name = write(node[1]);
      params = node[2];
      body = node.slice(3);
    }
    assert(node, isSymbolList(params), '"fn" needs it\'s params list to be a list of only symbols');
    return '(function ' + name + '(' + params.map(write).join(', ') + ') {' + writeBody(body) + '})';
  }

  // do/block
  if (calee === 'do') {
    return '(function () {' + writeBody(node.slice(1)) + '})()';
  }

  // if
  if (calee === 'if') {
    assert(node, node.length >= 3, '"set" needs 3 arguments (condition, then-branch, else-branch), got: ' + (node.length - 1));
    var thenBranch = [node[2]];
    var elseBranch = [node[3]];
    // no else is ok, it's just undefined
    if (typeof elseBranch[0] === 'undefined') {
      elseBranch = [list(symbol('void'), 0)];
    }
    // optimization: if one of the if branches is to be a `do` block, simply pass that body to writeBody
    if (isList(thenBranch[0]) && isSymbol(thenBranch[0][0]) && symbolName(thenBranch[0][0]) === 'do') {
      thenBranch = thenBranch[0].slice(1);
    }
    if (isList(elseBranch[0]) && isSymbol(elseBranch[0][0]) && symbolName(elseBranch[0][0]) === 'do') {
      elseBranch = elseBranch[0].slice(1);
    }
    return '(function () {if (' + write(node[1]) + ') {'
      + writeBody(thenBranch) + '} else {'
      + writeBody(elseBranch) + '}})()';
  }

  // call
  return write(node[0]) + '(' + node.slice(1).map(write).join(', ') + ')';
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
  return ast.map(write).join('\n').replace(/;/g, ';\n  ').replace(/{/g, '{\n  ') + '\n';
}
// }}}

// eval {{{
// Eval ast from a given env
function ethEval(context, ast) {
  var vm = require('vm').createScript(ethWrite(ast), {
    filename: 'eval',
    showErrors: false
  });
  if (context === null) {
    return vm.runInThisContext();
  } else {
    return vm.runInContext(context);
  }
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
  list: list,
  symbol: symbol,
  isList: isList,
  isArray: isArray,
  isObject: isObject,
  isSymbol: isSymbol,
  isKeyword: isKeyword,
  isString: isString,
  isNumber: isNumber,
  isSymbolList: isSymbolList,
  symbolName: symbolName,
  keywordName: keywordName,
  name: name,

  assert: assert,
  escapeSymbol: escapeSymbol,
  apply: apply,
  concat: concat,

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

